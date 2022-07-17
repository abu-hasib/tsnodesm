import { Query, Resolver } from "type-graphql";

@Resolver()
export class BookResolver {
  @Query(() => String)
  hello() {
    return "Hello World 1";
  }
}
