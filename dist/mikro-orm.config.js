"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const book_entity_1 = require("./entities/book.entity");
exports.default = {
    entities: [book_entity_1.Book],
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