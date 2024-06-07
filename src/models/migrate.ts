import "dotenv/config";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./client";

(async () => {
	await migrate(db, {
		migrationsFolder: "./drizzle/migrations",
	});
})();
