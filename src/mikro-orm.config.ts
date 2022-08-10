import { MikroORM } from "@mikro-orm/core";
import { Book } from "./entities/book.entity";
import { Post } from "./entities/post.entity";

export default {
  entities: [Book, Post],
  migrations: {
    path: "src/migrations",
    tableName: "migrations",
    transactional: true,
  },
  user: "postgres",
  password: "test",
  dbName: "postgres",
  type: "postgresql",
  debug: true,
  host: "localhost",
  port: 5432,
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
