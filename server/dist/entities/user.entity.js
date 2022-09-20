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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const user_validator_1 = require("../contracts/validators/user.validator");
let User = class User {
    constructor(body) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.email = body.email;
        this.password = body.password;
        this.username = body.username;
    }
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Unique)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Unique)(),
    (0, class_validator_1.MinLength)(3, {
        message: "Username is too short",
    }),
    (0, core_1.Property)(),
    (0, class_validator_1.NotContains)("@"),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3, {
        message: "Password is too short",
    }),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [user_validator_1.UserValidate])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map