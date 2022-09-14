"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const post_entity_1 = require("../entities/post.entity");
const sleep = (ms) => new Promise((resolve) => setTimeout(() => {
    resolve(post_entity_1.Post);
}, ms));
exports.sleep = sleep;
//# sourceMappingURL=sleep.js.map