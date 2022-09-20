"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220920125428 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220920125428 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null);');
        this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    }
    async down() {
        this.addSql('drop table if exists "user" cascade;');
        this.addSql('alter table "book" drop constraint "book_pkey";');
    }
}
exports.Migration20220920125428 = Migration20220920125428;
//# sourceMappingURL=Migration20220920125428.js.map