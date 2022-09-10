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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const user_entity_1 = require("../entities/user.entity");
const argon2_1 = __importDefault(require("argon2"));
const class_validator_1 = require("class-validator");
const formatConstraints_1 = require("../helpers/formatConstraints");
let UserValidate = class UserValidate {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserValidate.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserValidate.prototype, "password", void 0);
UserValidate = __decorate([
    (0, type_graphql_1.InputType)()
], UserValidate);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async me({ em, req }) {
        if (!req.session.userId)
            return null;
        const me = await em
            .getRepository(user_entity_1.User)
            .findOneOrFail({ id: req.session.userId });
        return me;
    }
    async register(input, { em, req }) {
        try {
            const newUser = new user_entity_1.User(input);
            const validateResult = await (0, class_validator_1.validate)(newUser);
            input.password = await argon2_1.default.hash(input.password);
            if (validateResult.length > 0) {
                const validationErrors = validateResult.map((error) => {
                    return {
                        field: error.property,
                        message: (0, formatConstraints_1.formatContraints)(error),
                    };
                });
                return {
                    errors: validationErrors,
                };
            }
            else {
                await em.persist(newUser).flush();
                req.session.userId = newUser.id;
            }
            return { user: newUser };
        }
        catch (err) {
            if (err.detail.includes("already exists")) {
                console.error("🆑", err.detail);
                return {
                    errors: [
                        {
                            field: "email",
                            message: "Email already exists",
                        },
                    ],
                };
            }
            return {
                errors: [
                    {
                        field: "email",
                        message: "Email already exists",
                    },
                ],
            };
        }
    }
    async login(input, { em, req }) {
        try {
            const user = await em
                .getRepository(user_entity_1.User)
                .findOneOrFail({ email: input.email });
            if (!user)
                return {
                    errors: [{ field: "email", message: "User does not exist" }],
                };
            const isValid = await argon2_1.default.verify(user.password, input.password);
            if (!isValid)
                return {
                    errors: [{ field: "password", message: "Incorrect password" }],
                };
            req.session.userId = user.id;
            return { user };
        }
        catch (err) {
            return {
                errors: [{ field: "email", message: "User not found" }],
            };
        }
    }
    async logout({ req, res }) {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                res.clearCookie("sid");
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => user_entity_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserValidate, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserValidate, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => user_entity_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map