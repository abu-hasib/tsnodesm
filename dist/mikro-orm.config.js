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
    user: process.env.MIKROORM_USERNAME,
    password: process.env.MIKROORM_PASSWORD,
    dbName: "postgres",
    type: "postgresql",
    debug: true,
    host: process.env.MIKROORM_HOST,
    port: process.env.MIKROORM_PORT,
    allowGlobalContext: true,
};
//# sourceMappingURL=mikro-orm.config.js.map