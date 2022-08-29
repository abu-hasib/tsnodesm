import "reflect-metadata";

import { ApolloServer, gql } from "apollo-server-express";
import { BookResolver } from "../resolvers/book.resolver";
import { buildSchema } from "type-graphql";
import { expect } from "chai";
import config from "../mikro-orm.config";

// import UserValidator from "../contracts/validators/user.validator";
import { UserResolver } from "../resolvers/user.resolver";
import { MikroORM } from "@mikro-orm/core";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// const userval = { email: String, password: String };

describe("User Service Unit Test suite", () => {
  it("should register a user into the DB if not exist", async () => {
    const orm = await MikroORM.init(config);
    const testServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [BookResolver, UserResolver],
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
    expect(result.errors).to.be.a("undefined");
    expect(result.data?.hello2).to.be.equal("Hello World 2");
  });
  it("should return expected string", () => {});
});

// import { expect } from "chai";

// describe("User unit test", function () {
//   describe("Save User functionality", function () {
//     it("should successfully add a user if the number of users in the DB with the same profiled is zero", async function name() {
//       expect();
//     });
//   });
// });
