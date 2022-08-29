import { Post } from "../entities/post.entity";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/utils/interfaces/context.interface";

@Resolver(() => Post)
export class PostResolver {
  @Query(() => [Post])
  public async getPosts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return await em.find(Post, {});
  }
  @Mutation(() => Post)
  public async addPost(@Arg("title") title: string, @Ctx() ctx: MyContext) {
    const post = new Post();
    post.title = title;
    ctx.em.persist(post).flush();
    return post;
  }
  @Mutation(() => Post, { nullable: true })
  public async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ) {
    if (!title) return false;
    try {
      const post = await em.getRepository(Post).findOneOrFail({ id });
      post.title = title;
      console.log(post);
      return post;
    } catch (err) {
      console.error(err.message);

      return null;
    }
  }
  @Mutation(() => Boolean, { nullable: true })
  public async deletePost(@Arg("id") id: number, @Ctx() { em }: MyContext) {
    try {
      const post = await em.getRepository(Post).findOneOrFail({ id });
      await em.getRepository(Post).remove(post).flush();
      return true;
    } catch (err) {
      console.error(err.message);
      return false;
    }
  }
}
