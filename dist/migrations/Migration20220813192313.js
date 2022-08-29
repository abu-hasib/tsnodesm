"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220813192313 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220813192313 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "password" varchar(255) not null);');
        this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
        this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null);');
        this.addSql('alter table "book" alter column "created_at" drop default;');
        this.addSql('alter table "book" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
        this.addSql('alter table "book" alter column "updated_at" drop default;');
        this.addSql('alter table "book" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    }
    async down() {
        this.addSql('drop table if exists "user" cascade;');
        this.addSql('drop table if exists "post" cascade;');
        this.addSql('alter table "book" alter column "created_at" type timestamp using ("created_at"::timestamp);');
        this.addSql('alter table "book" alter column "created_at" set default now();');
        this.addSql('alter table "book" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');
        this.addSql('alter table "book" alter column "updated_at" set default now();');
        this.addSql('alter table "book" drop constraint "book_pkey";');
    }
}
exports.Migration20220813192313 = Migration20220813192313;
//# sourceMappingURL=Migration20220813192313.js.map