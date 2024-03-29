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
const uuid_1 = require("uuid");
const user_entity_1 = require("../entities/user.entity");
const argon2_1 = __importDefault(require("argon2"));
const class_validator_1 = require("class-validator");
const formatConstraints_1 = require("../helpers/formatConstraints");
const sendEmail_1 = require("../helpers/sendEmail");
const constants_1 = require("../constants");
const user_validator_1 = require("../contracts/validators/user.validator");
const data_source_1 = require("../data-source");
const userRepo = data_source_1.AppDataSource.getRepository(user_entity_1.User);
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
    async changePassword({ redis }, token, password) {
        try {
            const key = constants_1.FORGET_PASSWORD_PREFIX + token;
            const userId = await redis.get(key);
            if (userId) {
                const user = await userRepo.findOneBy({ id: parseInt(userId) });
                if (user) {
                    const validateResult = await (0, class_validator_1.validate)(userRepo.create({
                        password,
                        createdAt: undefined,
                        updatedAt: undefined,
                        email: undefined,
                        username: undefined,
                    }), { skipMissingProperties: true });
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
                        await userRepo.update({ id: parseInt(userId) }, { password: await argon2_1.default.hash(password) });
                        redis.del(key);
                        return {
                            user,
                        };
                    }
                }
            }
            return { errors: [{ field: "token", message: "token expired" }] };
        }
        catch (error) {
            console.log(error);
            return {
                errors: [{ field: "token", message: "token expired" }],
            };
        }
    }
    async forgotPassword({ redis }, email) {
        try {
            const user = await userRepo.findOneByOrFail({ email });
            let token = (0, uuid_1.v4)();
            console.log("***: ", user.id);
            redis.set(constants_1.FORGET_PASSWORD_PREFIX + token, user.id, "EX", 1000 * 60 * 60 * 60 * 24 * 3);
            let msg = `<a href="http://localhost:3000/change-password/${token}">This is the link to change your password</a>`;
            (0, sendEmail_1.sendEmail)("lol@mail.com", msg);
            return true;
        }
        catch (error) {
            console.log("Here,", error);
            return false;
        }
    }
    async me({ req }) {
        if (!req.session.userId)
            return null;
        const me = await userRepo.findOneByOrFail({ id: req.session.userId });
        return me;
    }
    async register(input, { req }) {
        try {
            const newUser2 = userRepo.create(input);
            console.log("@@: ", newUser2);
            const validateResult = await (0, class_validator_1.validate)(newUser2);
            newUser2.password = await argon2_1.default.hash(newUser2.password);
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
                await userRepo.save(newUser2);
                req.session.userId = newUser2.id;
            }
            return { user: newUser2 };
        }
        catch (err) {
            console.log("&&: ", err);
            if (err.detail.includes("already exists")) {
                console.error("🆑", err.detail);
                return {
                    errors: [
                        {
                            field: "email",
                            message: "Email/username already exists",
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
    async login(login, password, { req }) {
        try {
            const user = await user_entity_1.User.findOneByOrFail(login.includes("@") ? { email: login } : { username: login });
            if (!user)
                return {
                    errors: [{ field: "email", message: "User does not exist" }],
                };
            const isValid = await argon2_1.default.verify(user.password, password);
            if (!isValid)
                return {
                    errors: [{ field: "password", message: "Incorrect password" }],
                };
            req.session.userId = user.id;
            return { user };
        }
        catch (err) {
            console.log("##: ", err);
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
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("token")),
    __param(2, (0, type_graphql_1.Arg)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
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
    __metadata("design:paramtypes", [user_validator_1.UserValidate, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("login")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
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