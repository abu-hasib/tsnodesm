"use strict";
exports.__esModule = true;
exports.sleep = void 0;
var post_entity_1 = require("../entities/post.entity");
var sleep = function (ms) {
    return new Promise(function (resolve) {
        return setTimeout(function () {
            resolve(post_entity_1.Post);
        }, ms);
    });
};
exports.sleep = sleep;
