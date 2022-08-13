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
const user_validator_1 = __importDefault(require("../contracts/validators/user.validator"));
const class_validator_1 = require("class-validator");
let UserResolver = class UserResolver {
    async register(input, { em }) {
        try {
            console.log("runing...");
            input.password = await argon2_1.default.hash(input.password);
            const newUser = new user_entity_1.User(input);
            (0, class_validator_1.validate)(newUser).then((errors) => {
                console.log("Class-Validator@@@:", errors);
                if (errors.length > 0)
                    console.error("🚨", errors);
            });
            console.log("?newUSwee", newUser);
            await em.persist(newUser).flush();
            return newUser;
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }
    async login(input, { em }) {
        try {
            const user = await em
                .getRepository(user_entity_1.User)
                .findOneOrFail({ email: input.email });
            if (!user)
                return null;
            const valid = await argon2_1.default.verify(user.password, input.password);
            if (valid)
                return user;
        }
        catch (err) {
            console.error("🚨", err);
            return null;
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => user_entity_1.User),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_validator_1.default, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_entity_1.User),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_validator_1.default, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => user_entity_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map