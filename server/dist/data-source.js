"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
const user_entity_1 = require("./entities/user.entity");
const path_1 = __importDefault(require("path"));
const upvote_entity_1 = require("./entities/upvote.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    database: "tsnodesm2",
    logging: true,
    entities: [user_entity_1.User, post_entity_1.Post, upvote_entity_1.Upvote],
    migrations: [path_1.default.join(__dirname, "./migrations/*")],
    synchronize: true,
});
//# sourceMappingURL=data-source.js.map