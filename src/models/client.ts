import Database from "better-sqlite3";
import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

const sqlite = new Database(process.env.SQLITE ?? "data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

export type DB = typeof db;

export type Article = typeof schema.articles.$inferSelect;
export type InsertArticle = typeof schema.articles.$inferInsert;

export type Session = typeof schema.sessions.$inferSelect;
export type InsertSession = typeof schema.sessions.$inferInsert;
