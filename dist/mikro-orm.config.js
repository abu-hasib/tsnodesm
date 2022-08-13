"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const book_entity_1 = require("./entities/book.entity");
const post_entity_1 = require("./entities/post.entity");
const user_entity_1 = require("./entities/user.entity");
exports.default = {
    entities: [book_entity_1.Book, post_entity_1.Post, user_entity_1.User],
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
};
//# sourceMappingURL=mikro-orm.config.js.map