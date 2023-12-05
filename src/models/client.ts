import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as Database from "better-sqlite3";

import * as schema from "./schema";

const sqlite = new Database(process.env.SQLITE ?? "data.db");
sqlite.pragma("journal_mode = WAL");
export const db = drizzle(sqlite, { schema });

export type Article = typeof schema.articles.$inferSelect;
export type InsertArticle = typeof schema.articles.$inferInsert;

export type Chat = typeof schema.chats.$inferSelect;
export type InsertChat = typeof schema.chats.$inferInsert;

export type User = typeof schema.users.$inferSelect;
export type InsertUser = typeof schema.users.$inferInsert;
