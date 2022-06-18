// console.log("Hellop@!");
import { MikroORM } from "@mikro-orm/core";
import { Book } from "./entities/book.entity";
import config from "./mikro-orm.config";

async function main() {
  try {
    const orm = await MikroORM.init(config);
    const migrator = await orm.getMigrator();
    const migrations = await migrator.getPendingMigrations();
    if (migrations && migrations.length > 0) {
      await migrator.up();
    }

    const book = new Book();
    book.name = "Bisi Adeyanju";
    const book1 = new Book();
    const book2 = new Book();
    book1.name = "Abu ola";
    book2.name = "Another";
    await orm.em.persist(book).flush();
    await orm.em.persist(book1).flush();
    await orm.em.persist(book2).flush();
  } catch (error) {
    console.error("📌 Could not connect to the database", error);
    throw Error(error);
  }
}

main().catch((err) => console.error("main: 📌 error --->", err));
