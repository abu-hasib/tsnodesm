import { MikroORM } from "@mikro-orm/core";
import { Book } from "./entities/book.entity";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";

export default {
  entities: [Book, Post, User],
  migrations: {
    path: "src/migrations",
    tableName: "migrations",
    transactional: true,
  },
  user: process.env.MIKROORM_USERNAME,
  password: process.env.MIKROORM_PASSWORD,
  dbName: "postgres",
  type: "postgresql",
  debug: true,
  host: process.env.MIKROORM_HOST,
  port: process.env.MIKROORM_PORT,
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
