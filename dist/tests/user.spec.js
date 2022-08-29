"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const book_resolver_1 = require("../resolvers/book.resolver");
const type_graphql_1 = require("type-graphql");
const chai_1 = require("chai");
const mikro_orm_config_1 = __importDefault(require("../mikro-orm.config"));
const user_resolver_1 = require("../resolvers/user.resolver");
const core_1 = require("@mikro-orm/core");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    hello: String
  }
`;
describe("User Service Unit Test suite", () => {
    it("should register a user into the DB if not exist", async () => {
        var _a;
        const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
        const testServer = new apollo_server_express_1.ApolloServer({
            schema: await (0, type_graphql_1.buildSchema)({
                resolvers: [book_resolver_1.BookResolver, user_resolver_1.UserResolver],
            }),
            typeDefs,
            context: orm,
        });
        const result = await testServer.executeOperation({
            query: `mutation Mutation($input: UserValidator!) {
        register(input: $input) {
          errors {
            field
            message
          }
          user {
            id
            email
          }
        }
      }`,
            variables: {
                input: { email: "user@mail", password: "user" },
            },
        });
        console.log("@@@:", result);
        (0, chai_1.expect)(result.errors).to.be.a("undefined");
        (0, chai_1.expect)((_a = result.data) === null || _a === void 0 ? void 0 : _a.hello2).to.be.equal("Hello World 2");
    });
    it("should return expected string", () => { });
});
//# sourceMappingURL=user.spec.js.map