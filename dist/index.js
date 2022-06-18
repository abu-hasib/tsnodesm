"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const book_entity_1 = require("./entities/book.entity");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
async function main() {
    try {
        const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
        const migrator = await orm.getMigrator();
        const migrations = await migrator.getPendingMigrations();
        if (migrations && migrations.length > 0) {
            await migrator.up();
        }
        const book = new book_entity_1.Book();
        book.name = "Bisi Adeyanju";
        const book1 = new book_entity_1.Book();
        const book2 = new book_entity_1.Book();
        book1.name = "Abu ola";
        book2.name = "Another";
        await orm.em.persist(book).flush();
        await orm.em.persist(book1).flush();
        await orm.em.persist(book2).flush();
    }
    catch (error) {
        console.error("📌 Could not connect to the database", error);
        throw Error(error);
    }
}
main().catch((err) => console.error("main: 📌 error --->", err));
//# sourceMappingURL=index.js.map