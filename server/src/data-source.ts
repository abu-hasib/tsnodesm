import { DataSource } from "typeorm";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT as number | undefined,
  database: "tsnodesm2",
  logging: true,
  entities: [User, Post],
  synchronize: true,
});
