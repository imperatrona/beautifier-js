import { eq, sql } from "drizzle-orm";
import { db } from "./client";
import { articles } from "./schema";

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

export async function createArticle(url: string, telegraph_url: string[]) {
	let article: Article | null = null;
	try {
		article = (
			await db
				.insert(articles)
				.values({
					url: url,
					telegraphUrl: telegraph_url,
				})
				.returning()
		)[0];
	} catch (err) {
		article = await db.query.articles.findFirst({
			where: eq(articles.url, url),
		}) ?? null;
	}
	return article;
}

export async function findArticle(url: string) {
	const article = await db.query.articles.findFirst({
		where: eq(articles.url, url),
	});
	return article;
}

export async function deleteArticle(url: string) {
	const article = await db.query.articles.findFirst({
		where: eq(articles.url, url),
	});
	if (article) {
		await db.delete(articles).where(eq(articles.url, url));
	}
}

export async function deleteAllArticles() {
	await db.delete(articles);
}

export async function countArticles() {
	const count = await db
		.select({
			count: sql`count() as count`,
		})
		.from(articles);

	return count[0].count;
}
