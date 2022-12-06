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
const upvote_entity_1 = require("../entities/upvote.entity");
const postRepo = data_source_1.AppDataSource.getRepository(post_entity_1.Post);
const upvoteRepo = data_source_1.AppDataSource.getRepository(upvote_entity_1.Upvote);
const queryRunner = data_source_1.AppDataSource.createQueryRunner();
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
let PostObject = class PostObject {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PostObject.prototype, "hasMore", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [post_entity_1.Post]),
    __metadata("design:type", Array)
], PostObject.prototype, "posts", void 0);
PostObject = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostObject);
let PostResolver = class PostResolver {
    async vote(postId, value, { req }) {
        const { userId } = req.session;
        const evalValue = value !== -1 ? 1 : -1;
        const isExist = await upvoteRepo.findOneBy({ postId });
        if (!isExist) {
            await upvoteRepo.insert({
                userId,
                postId,
                value: evalValue,
            });
        }
        queryRunner.query(`
      update post
      set points = points +  $1
      where id = $2
    `, [evalValue, postId]);
        return true;
    }
    async getPosts(limit, cursor) {
        const cap = Math.min(50, limit);
        const args = [];
        if (cursor) {
            args.push(new Date(cursor));
        }
        const posts = await queryRunner.query(`
    select post.*,
    json_build_object(
      'id', "user".id,
      'username', "user".username,
      'email', "user".email,
      'createdAt', "user"."createdAt",
      'updatedAt', "user"."updatedAt"
     ) creator
    from post
    inner join "user" on "post"."creatorId" = "user".id
    ${cursor ? `where post."createdAt" < $1` : ""}
    order by post."createdAt" desc
    limit ${cap}
    `, args);
        return {
            hasMore: posts.length === cap,
            posts: posts,
        };
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
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("postId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("value", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
__decorate([
    (0, type_graphql_1.Query)(() => PostObject),
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