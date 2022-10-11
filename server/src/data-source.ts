import { DataSource } from "typeorm";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";
import path from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT as number | undefined,
  database: "tsnodesm2",
  logging: true,
  entities: [User, Post],
  migrations: [path.join(__dirname, "./migrations/*")],
  synchronize: true,
});
