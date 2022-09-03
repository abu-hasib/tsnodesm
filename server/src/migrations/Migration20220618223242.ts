import { Migration } from "@mikro-orm/migrations";

export class Migration20220618223242 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'CREATE TABLE "book" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" varchar(255) not null);'
    );

    this.addSql('drop table if exists "photo" cascade;');

    this.addSql('drop table if exists "typeorm_metadata" cascade;');
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "photo" ("id" serial, "name" varchar not null default null, "description" text not null default null, "filename" varchar not null default null, "views" int4 not null default null, "isPublished" bool not null default null);'
    );
    this.addSql(
      'alter table "photo" add constraint "PK_723fa50bf70dcfd06fb5a44d4ff" primary key ("id");'
    );

    this.addSql(
      'create table "typeorm_metadata" ("type" varchar not null default null, "database" varchar null default null, "schema" varchar null default null, "table" varchar null default null, "name" varchar null default null, "value" text null default null);'
    );

    this.addSql('drop table if exists "book" cascade;');
  }
}
