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
const data_source_1 = require("../data-source");
const isAuth_1 = require("../middleware/isAuth");
const postRepo = data_source_1.AppDataSource.getRepository(post_entity_1.Post);
let PostInput = class PostInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PostInput.prototype, "text", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PostResolver = class PostResolver {
    async getPosts(limit, cursor) {
        const cap = Math.min(50, limit);
        const qb = postRepo
            .createQueryBuilder("post")
            .take(cap)
            .orderBy('"createdAt"', "DESC");
        if (cursor) {
            qb.where('"updatedAt" < :cursor', { cursor });
        }
        return qb.getMany();
    }
    async createPost(input, { req }) {
        const post = postRepo.create(Object.assign(Object.assign({}, input), { creatorId: req.session.userId }));
        return await postRepo.save(post);
    }
    async updatePost(id, title) {
        if (!title)
            return false;
        try {
            const postToUpdate = await postRepo.findOneBy({ id });
            if (!postToUpdate)
                return null;
            postToUpdate.title = title;
            console.log(postToUpdate);
            await postRepo.save(postToUpdate);
            return postToUpdate;
        }
        catch (err) {
            console.error(err.message);
            return null;
        }
    }
    async deletePost(id) {
        try {
            const postToRemove = await postRepo.findOneBy({ id });
            if (!postToRemove)
                return;
            await postRepo.remove(postToRemove);
            return true;
        }
        catch (err) {
            console.error(err.message);
            return false;
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [post_entity_1.Post]),
    __param(0, (0, type_graphql_1.Arg)("limit", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("cursor", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPosts", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_entity_1.Post),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_entity_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("title")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => post_entity_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.resolver.js.map