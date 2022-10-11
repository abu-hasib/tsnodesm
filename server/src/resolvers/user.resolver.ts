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
import { AppDataSource } from "../data-source";
const userRepo = AppDataSource.getRepository(User);

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
  /**
   * changePassword
   */
  public async changePassword(
    @Ctx() { redis }: MyContext,
    @Arg("token") token: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    try {
      const key = FORGET_PASSWORD_PREFIX + token;
      const userId = await redis.get(key);
      if (userId) {
        const user = await userRepo.findOneBy({ id: parseInt(userId) });
        if (user) {
          const validateResult = await validate(
            userRepo.create({
              password,
              createdAt: undefined,
              updatedAt: undefined,
              email: undefined,
              username: undefined,
            }),
            { skipMissingProperties: true }
          );
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
            await userRepo.update(
              { id: parseInt(userId) },
              { password: await argon2.hash(password) }
            );
            redis.del(key);
            return {
              user,
            };
          }
        }
      }
      return { errors: [{ field: "token", message: "token expired" }] };
    } catch (error) {
      console.log(error);
      return {
        errors: [{ field: "token", message: "token expired" }],
      };
    }
  }
  @Mutation(() => Boolean)
  public async forgotPassword(
    @Ctx() { redis }: MyContext,
    @Arg("email") email: string
  ) {
    try {
      const user = await userRepo.findOneByOrFail({ email });
      let token = v4();
      console.log("***: ", user.id);
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
  public async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) return null;
    const me = await userRepo.findOneByOrFail({ id: req.session.userId });
    return me;
  }

  @Mutation(() => UserResponse)
  public async register(
    @Arg("input") input: UserValidate,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      const newUser2 = userRepo.create(input);
      console.log("@@: ", newUser2);

      const validateResult = await validate(newUser2);
      newUser2.password = await argon2.hash(newUser2.password);
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
        await userRepo.save(newUser2);
        req.session.userId = newUser2.id;
      }
      return { user: newUser2 };
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
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await User.findOneByOrFail(
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
