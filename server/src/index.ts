// console.log("Hellop@!");
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
// import { Book } from "./entities/book.entity";
import express from "express";
import { buildSchema } from "type-graphql";

import config from "./mikro-orm.config";
import { BookResolver } from "./resolvers/book.resolver";
import http from "http";
import { PostResolver } from "./resolvers/post.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
import cors from "cors";

async function main() {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    const orm = await MikroORM.init(config);
    const migrator = await orm.getMigrator();
    const migrations = await migrator.getPendingMigrations();
    if (migrations && migrations.length > 0) {
      console.log("%%: ", migrations.length);
      await migrator.up();
    }

    // redis@v4
    const { createClient } = require("redis");
    let redisClient = createClient({ legacyMode: true });
    redisClient.connect().catch(console.error);
    redisClient.on("error", console.error);
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    app.use(
      session({
        name: "sid",
        store: new RedisStore({ client: redisClient, disableTouch: true }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          sameSite: "lax",
        },
        saveUninitialized: false,
        secret: "lkjhgfdsa",
        resave: false,
      })
    );

    const server = new ApolloServer({
      schema: await buildSchema({
        resolvers: [BookResolver, PostResolver, UserResolver],
      }),
      context: ({ req, res }) => ({
        em: orm.em,
        req,
        res,
        redis: redisClient,
      }),
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
    });

    await server.start();

    server.applyMiddleware({ app, cors: false });

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );

    // const book = new Book();n
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
