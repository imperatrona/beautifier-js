import { sql } from "drizzle-orm";
import {
	integer,
	sqliteTable,
	text,
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
	}),
);

export const sessions = sqliteTable(
	"sessions",
	{
		id: integer("id").primaryKey(),
		key: text("key"),
		value: text("value"),
	},
	(sessions) => ({
		sessionKeyIndex: uniqueIndex("sessionKeyIndex").on(sessions.key),
	}),
);

export type SessionsTable = typeof sessions;
