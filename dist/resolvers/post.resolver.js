"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const post_entity_1 = require("../entities/post.entity");
const type_graphql_1 = require("type-graphql");
let PostResolver = class PostResolver {
    async getPosts({ em }) {
        return await em.find(post_entity_1.Post, {});
    }
    async addPost(title, ctx) {
        const post = new post_entity_1.Post();
        post.title = title;
        ctx.em.persist(post).flush();
        return post;
    }
    async updatePost(id, title, { em }) {
        const post = await em.getRepository(post_entity_1.Post).findOneOrFail({ id });
        post.title = title;
        await em.persist(post).flush();
        return post;
    }
    async deletePost(id, { em }) {
        const post = await em.getRepository(post_entity_1.Post).findOneOrFail({ id });
        await em.getRepository(post_entity_1.Post).remove(post).flush();
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [post_entity_1.Post]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPosts", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_entity_1.Post),
    __param(0, (0, type_graphql_1.Arg)("title")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "addPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_entity_1.Post),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("title")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_entity_1.Post),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => post_entity_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.resolver.js.map