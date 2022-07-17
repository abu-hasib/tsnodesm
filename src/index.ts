// console.log("Hellop@!");
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
// import { Book } from "./entities/book.entity";
import express from "express";
import { buildSchema } from "type-graphql";
import config from "./mikro-orm.config";
import { BookResolver } from "./resolvers/book.resolver";
import http from "http";

async function main() {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    const orm = await MikroORM.init(config);
    const migrator = await orm.getMigrator();
    const migrations = await migrator.getPendingMigrations();
    if (migrations && migrations.length > 0) {
      await migrator.up();
    }

    const server = new ApolloServer({
      schema: await buildSchema({ resolvers: [BookResolver] }),
    });

    await server.start();

    server.applyMiddleware({ app });

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );

    // const book = new Book();
    // book.name = "Bisi Adeyanju";
    // const book1 = new Book();
    // const book2 = new Book();
    // book1.name = "Abu ola";
    // book2.name = "Another";
    // await orm.em.persist(book).flush();
    // await orm.em.persist(book1).flush();
    // await orm.em.persist(book2).flush();
  } catch (error) {
    console.error("📌 Could not connect to the database", error);
    throw Error(error);
  }
}

main().catch((err) => console.error("main: 📌 error --->", err));
