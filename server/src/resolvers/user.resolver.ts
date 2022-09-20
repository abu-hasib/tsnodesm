import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { v4 } from "uuid";
import { MyContext } from "src/utils/interfaces/context.interface";
import { User } from "../entities/user.entity";
import argon2 from "argon2";
import { validate } from "class-validator";
import { formatContraints } from "../helpers/formatConstraints";
import { sendEmail } from "../helpers/sendEmail";
import { FORGET_PASSWORD_PREFIX } from "../constants";
import { UserValidate } from "../contracts/validators/user.validator";
// ll

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
  @Mutation(() => Boolean)
  public async forgotPassword(
    @Ctx() { em, redis }: MyContext,
    @Arg("email") email: string
  ) {
    try {
      const user = await em.getRepository(User).findOneOrFail({ email });
      let token = v4();
      redis.set(
        FORGET_PASSWORD_PREFIX + token,
        user.id,
        "EX",
        1000 * 60 * 60 * 60 * 24 * 3
      );
      // if (!user) return false;
      let msg = `<a href="http://localhost:3000/change-password/${token}">This is the link to change your password</a>`;
      sendEmail("lol@mail.com", msg);
      return true;
    } catch (error) {
      console.log("Here,", error);
      return false;
    }
  }

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
      newUser.password = await argon2.hash(input.password);
      console.log("$$: ", newUser.password);
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
      console.log("&&: ", err);
      if (err.detail.includes("already exists")) {
        console.error("🆑", err.detail);
        return {
          errors: [
            {
              field: "email",
              message: "Email/username already exists",
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
    @Arg("login") login: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await em
        .getRepository(User)
        .findOneOrFail(
          login.includes("@") ? { email: login } : { username: login }
        );
      if (!user)
        return {
          errors: [{ field: "email", message: "User does not exist" }],
        };
      const isValid = await argon2.verify(user.password, password);
      if (!isValid)
        return {
          errors: [{ field: "password", message: "Incorrect password" }],
        };
      req.session.userId = user.id;
      return { user };
    } catch (err) {
      console.log("##: ", err);
      return {
        errors: [{ field: "email", message: "User not found" }],
      };
    }
  }
  @Mutation(() => Boolean)
  public async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie("sid");
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}
