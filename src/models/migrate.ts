import "dotenv/config";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import Database from "better-sqlite3";

const sqlite = new Database(process.env.SQLITE ?? "data.db");
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite, { schema });

(async () => {
  await migrate(db, {
    migrationsFolder: "./drizzle/migrations",
  });
})();
