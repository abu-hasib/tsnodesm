import { Field, ObjectType } from "type-graphql";
import { IsEmail, IsNotEmpty, MinLength, NotContains } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./post.entity";
import { Upvote } from "./upvote.entity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @Field()
  @MinLength(3, {
    message: "Username is too short",
  })
  @Column({ unique: true })
  @NotContains("@")
  username: string;

  @IsNotEmpty()
  @MinLength(3, {
    message: "Password is too short",
  })
  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany(() => Upvote, (upvote) => upvote.user)
  upvotes: Upvote[];

  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
