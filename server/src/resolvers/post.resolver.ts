import { Post } from "../entities/post.entity";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { AppDataSource } from "../data-source";
import { MyContext } from "src/utils/interfaces/context.interface";
import { isAuth } from "../middleware/isAuth";
const postRepo = AppDataSource.getRepository(Post);

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  text: string;
}

@ObjectType()
class PostObject {
  @Field()
  hasMore: boolean;

  @Field(() => [Post])
  posts: Post[];
}

@Resolver(() => Post)
export class PostResolver {
  @Query(() => PostObject)
  public async getPosts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
  ): Promise<Promise<PostObject>> {
    const cap = Math.min(50, limit);
    const capPlus1 = cap + 1;
    const qb = postRepo
      .createQueryBuilder("post")
      .take(cap)
      .orderBy('"createdAt"', "DESC");

    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor });
      // '"post"."createdAt" > :cursor', { cursor }
    }
    const posts = await qb.getMany();
    console.log(posts.length, capPlus1);
    return {
      hasMore: posts.length === cap,
      posts: posts,
    };
    // return await postRepo.find({});
  }
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  public async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ) {
    const post = postRepo.create({ ...input, creatorId: req.session.userId });
    return await postRepo.save(post);
  }

  @Mutation(() => Post, { nullable: true })
  public async updatePost(@Arg("id") id: number, @Arg("title") title: string) {
    if (!title) return false;
    try {
      const postToUpdate = await postRepo.findOneBy({ id });
      if (!postToUpdate) return null;
      postToUpdate.title = title;
      console.log(postToUpdate);
      await postRepo.save(postToUpdate);
      return postToUpdate;
    } catch (err) {
      console.error(err.message);

      return null;
    }
  }

  @Mutation(() => Boolean, { nullable: true })
  public async deletePost(@Arg("id") id: number) {
    try {
      const postToRemove = await postRepo.findOneBy({ id });
      if (!postToRemove) return;
      await postRepo.remove(postToRemove);
      return true;
    } catch (err) {
      console.error(err.message);
      return false;
    }
  }
}
