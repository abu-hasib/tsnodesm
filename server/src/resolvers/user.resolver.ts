import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext } from "src/utils/interfaces/context.interface";
import { User } from "../entities/user.entity";
import argon2 from "argon2";
import { validate } from "class-validator";
import { formatContraints } from "../helpers/formatConstraints";

@InputType()
class UserValidate {
  @Field()
  public email: string;

  @Field()
  password: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  public async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) return null;
    const me = await em
      .getRepository(User)
      .findOneOrFail({ id: req.session.userId });
    return me;
  }
  @Mutation(() => UserResponse)
  public async register(
    @Arg("input") input: UserValidate,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      const newUser = new User(input);
      const validateResult = await validate(newUser);
      input.password = await argon2.hash(input.password);
      if (validateResult.length > 0) {
        const validationErrors = validateResult.map((error) => {
          return {
            field: error.property,
            message: formatContraints(error),
          };
        });

        return {
          errors: validationErrors,
        };
      } else {
        await em.persist(newUser).flush();
        req.session.userId = newUser.id;
      }
      return { user: newUser };
    } catch (err) {
      if (err.detail.includes("already exists")) {
        console.error("🆑", err.detail);
        return {
          errors: [
            {
              field: "email",
              message: "Email already exists",
            },
          ],
        };
      }
      return {
        errors: [
          {
            field: "email",
            message: "Email already exists",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  public async login(
    @Arg("input") input: UserValidate,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await em
        .getRepository(User)
        .findOneOrFail({ email: input.email });
      if (!user)
        return {
          errors: [{ field: "email", message: "User does not exist" }],
        };
      const isValid = await argon2.verify(user.password, input.password);
      if (!isValid)
        return {
          errors: [{ field: "password", message: "Incorrect password" }],
        };
      req.session.userId = user.id;
      return { user };
    } catch (err) {
      return {
        errors: [{ field: "email", message: "User not found" }],
      };
    }
  }
}
