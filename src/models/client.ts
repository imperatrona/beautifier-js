import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import * as schema from "./schema";

const sqlite = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});
export const db = drizzle(sqlite, { schema });

export type Article = typeof schema.articles.$inferSelect;
export type InsertArticle = typeof schema.articles.$inferInsert;

export type Chat = typeof schema.chats.$inferSelect;
export type InsertChat = typeof schema.chats.$inferInsert;

export type User = typeof schema.users.$inferSelect;
export type InsertUser = typeof schema.users.$inferInsert;
