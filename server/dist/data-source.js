"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
const user_entity_1 = require("./entities/user.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    database: "tsnodesm2",
    logging: true,
    entities: [user_entity_1.User, post_entity_1.Post],
    synchronize: true,
});
//# sourceMappingURL=data-source.js.map