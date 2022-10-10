import { Post } from "../entities/post.entity";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
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

@Resolver(() => Post)
export class PostResolver {
  @Query(() => [Post])
  public async getPosts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
  ): Promise<Post[]> {
    const cap = Math.min(50, limit);
    const qb = postRepo
      .createQueryBuilder("post")
      .take(cap)
      .orderBy('"createdAt"', "DESC");

    if (cursor) {
      qb.where('"updatedAt" < :cursor', { cursor });
      // '"post"."createdAt" > :cursor', { cursor }
    }
    return qb.getMany();
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
