import { DataSource } from "typeorm";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";
import path from "path";
import { Upvote } from "./entities/upvote.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  username: process.env.TYPEORM_USERNAME,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT as number | undefined,
  database: "tsnodesm2",
  logging: true,
  entities: [User, Post, Upvote],
  migrations: [path.join(__dirname, "./migrations/*")],
  synchronize: true,
});
