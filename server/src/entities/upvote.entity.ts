import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";

// many to one
// many to many
// users <--> posts
// users <- upvote -> posts;

@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.upvotes)
  post: Post;
}
