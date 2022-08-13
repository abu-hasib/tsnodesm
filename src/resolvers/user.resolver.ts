import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "src/utils/interfaces/context.interface";
import { User } from "../entities/user.entity";
import argon2 from "argon2";
import UserValidator from "../contracts/validators/user.validator";
import { validate } from "class-validator";

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User)
  public async register(
    @Arg("input") input: UserValidator,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    try {
      console.log("runing...");
      input.password = await argon2.hash(input.password);
      const newUser = new User(input);
      validate(newUser).then((errors) => {
        console.log("Class-Validator@@@:", errors);
        if (errors.length > 0) console.error("🚨", errors);
      });
      console.log("?newUSwee", newUser);
      await em.persist(newUser).flush();
      return newUser;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  @Mutation(() => User)
  public async login(
    @Arg("input") input: UserValidator,
    @Ctx() { em }: MyContext
  ): Promise<User | null | undefined> {
    try {
      const user = await em
        .getRepository(User)
        .findOneOrFail({ email: input.email });
      if (!user) return null;
      const valid = await argon2.verify(user.password, input.password);
      if (valid) return user;
    } catch (err) {
      console.error("🚨", err);
      return null;
    }
  }
}
