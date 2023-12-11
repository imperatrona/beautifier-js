import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const base = {
  id: integer("id").primaryKey(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
};

export const articles = sqliteTable(
  "articles",
  {
    ...base,
    url: text("url"),
    telegraphUrl: text("telegraph_url", { mode: "json" }).$type<string[]>(),
  },
  (articles) => ({
    urlIndex: uniqueIndex("urlIndex").on(articles.url),
    urlLinkIndex: uniqueIndex("urlLinkIndex").on(articles.url),
  })
);

export const chats = sqliteTable(
  "chats",
  {
    ...base,
    chatId: integer("chat_id"),
    language: text("language").default("en"),
    interactive: integer("interactive", { mode: "boolean" }).default(true),
  },
  (chats) => ({
    chatIdIndex: uniqueIndex("chatIdIndex").on(chats.chatId),
  })
);

export const users = sqliteTable(
  "users",
  {
    ...base,
    userId: integer("user_id"),
    language: text("language").default("en"),
  },
  (users) => ({
    userIdIndex: uniqueIndex("userIdIndex").on(users.userId),
  })
);
