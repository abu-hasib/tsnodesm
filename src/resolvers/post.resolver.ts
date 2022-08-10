import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Post } from "../entities/post.entity";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

interface MyContext {
  req: Request;
  res: Response;
  em: EntityManager<IDatabaseDriver<Connection>>;
}

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
  @Mutation(() => Post)
  public async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ) {
    const post = await em.getRepository(Post).findOneOrFail({ id });
    post.title = title;
    await em.persist(post).flush();
    return post;
  }
  @Mutation(() => Post)
  public async deletePost(@Arg("id") id: number, @Ctx() { em }: MyContext) {
    const post = await em.getRepository(Post).findOneOrFail({ id });
    await em.getRepository(Post).remove(post).flush();
    return true;
  }
}
