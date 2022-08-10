import { Query, Resolver } from "type-graphql";

@Resolver()
export class BookResolver {
  @Query(() => String)
  hello() {
    return "Hello World 1";
  }
  @Query(() => String)
  hello2() {
    return "Hello World 2";
  }
}
