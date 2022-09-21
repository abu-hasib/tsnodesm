"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const book_resolver_1 = require("./resolvers/book.resolver");
const http_1 = __importDefault(require("http"));
const post_resolver_1 = require("./resolvers/post.resolver");
const user_resolver_1 = require("./resolvers/user.resolver");
const apollo_server_core_1 = require("apollo-server-core");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
async function main() {
    try {
        const app = (0, express_1.default)();
        const httpServer = http_1.default.createServer(app);
        const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
        const migrator = await orm.getMigrator();
        const migrations = await migrator.getPendingMigrations();
        if (migrations && migrations.length > 0) {
            console.log("%%: ", migrations.length);
            await migrator.up();
        }
        let redisClient = new ioredis_1.default();
        app.use((0, cors_1.default)({
            origin: "http://localhost:3000",
            credentials: true,
        }));
        app.use(session({
            name: "sid",
            store: new RedisStore({ client: redisClient, disableTouch: true }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                httpOnly: true,
                sameSite: "lax",
            },
            saveUninitialized: false,
            secret: "lkjhgfdsa",
            resave: false,
        }));
        const server = new apollo_server_express_1.ApolloServer({
            schema: await (0, type_graphql_1.buildSchema)({
                resolvers: [book_resolver_1.BookResolver, post_resolver_1.PostResolver, user_resolver_1.UserResolver],
            }),
            context: ({ req, res }) => ({
                em: orm.em,
                req,
                res,
                redis: redisClient,
            }),
            plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)({})],
        });
        await server.start();
        server.applyMiddleware({ app, cors: false });
        await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    }
    catch (error) {
        console.error("📌 Could not connect to the database", error);
        throw Error(error);
    }
}
main().catch((err) => console.error("main: 📌 error --->", err));
//# sourceMappingURL=index.js.map