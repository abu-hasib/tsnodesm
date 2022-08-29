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
async function main() {
    try {
        console.log("%%: ", process.env.NODE_ENV);
        const app = (0, express_1.default)();
        const httpServer = http_1.default.createServer(app);
        const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
        const migrator = await orm.getMigrator();
        const migrations = await migrator.getPendingMigrations();
        if (migrations && migrations.length > 0) {
            await migrator.up();
        }
        const server = new apollo_server_express_1.ApolloServer({
            schema: await (0, type_graphql_1.buildSchema)({
                resolvers: [book_resolver_1.BookResolver, post_resolver_1.PostResolver, user_resolver_1.UserResolver],
            }),
            context: orm,
        });
        await server.start();
        server.applyMiddleware({ app });
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