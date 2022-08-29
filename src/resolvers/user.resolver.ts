import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { MyContext } from "src/utils/interfaces/context.interface";
import { User } from "../entities/user.entity";
import argon2 from "argon2";
import UserValidator from "../contracts/validators/user.validator";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
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
  @Mutation(() => UserResponse)
  public async register(
    @Arg("input", { validate: true }) input: UserValidator,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    try {
      input.password = await argon2.hash(input.password);
      const newUser = new User(input);
      console.log("?newUser", newUser);
      await em.persist(newUser).flush();
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
    @Arg("input") input: UserValidator,
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
          errors: [{ field: "email", message: "Incorrect password" }],
        };
      req.session.userId = user.id;
      console.log("$$$: ", req.session);

      return { user };
    } catch (err) {
      console.error("🚨", err.message);
      return {
        errors: [{ field: "email", message: err.message }],
      };
    }
  }
}
