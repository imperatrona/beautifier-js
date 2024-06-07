import { Atransform } from "@/commands/contentTransformer";
import {
	addPrevNext,
	createPages,
	splitArray,
} from "@/commands/telegraphPrepare";
import { detectURL, processURL } from "@/commands/urlprocessor";
import type { Context } from "@/context";
import {
	countArticles,
	createArticle,
	deleteAllArticles,
	deleteArticle,
	findArticle,
	type Article,
} from "@/models/articles";
import { Readability, isProbablyReaderable } from "@mozilla/readability";
import cheerio from "cheerio";
import { Composer } from "grammy";
import { JSDOM, VirtualConsole } from "jsdom";
import telegraph from "telegraph-node";

export const beautify = new Composer<Context>()
	.command("clear", async (ctx) => {
		const urls = detectURL(ctx.message.reply_to_message);

		for (const url of urls) {
			const processedUrl = processURL(url);
			await deleteArticle(processedUrl);
		}

		await ctx.deleteMessage();
	})
	.command("stats", async (ctx) => {
		if (ctx.message.from.id === Number.parseInt(process.env.ADMIN_ID)) {
			ctx.reply(`Total articles: ${await countArticles()}`);
		}
	})
	.command("clearAll", async (ctx) => {
		if (ctx.message.from.id === Number.parseInt(process.env.ADMIN_ID)) {
			await deleteAllArticles();
		}
		await ctx.deleteMessage();
	})
	.command("interactive", async (ctx) => {
		ctx.session.interactive = !ctx.session.interactive;
		ctx.session.updatedAt = new Date();
		ctx.reply(
			`ok. set to ${
				ctx.session.interactive ? "interactive" : "non interactive"
			}`,
		);
	})
	.command("instant", async (ctx) => {
		const replyMessage = ctx.message.reply_to_message;
		if (!("text" in replyMessage || "caption" in replyMessage)) {
			return;
		}

		const urls = detectURL(replyMessage);

		if (urls.length < 1) {
			return;
		}

		ctx.api.sendChatAction(ctx.chat.id, "typing");

		const resultUrls = await messageProcessing(urls, ctx);

		const text =
			"text" in replyMessage ? replyMessage.text : replyMessage.caption;
		const response = generateResponse(text, resultUrls);

		if (response.length > 0) {
			ctx.replyWithHTML(response, {
				reply_to_message_id: ctx.message.message_id,
			});
		}
	})
	.on("message", async (ctx) => {
		if (
			(!ctx.session.interactive || ctx.message.chat.type !== "private") &&
			!("text" in ctx.message || "caption" in ctx.message)
		) {
			return;
		}

		const urls = detectURL(ctx.message);

		if (urls.length < 1) {
			return;
		}

		ctx.api.sendChatAction(ctx.chat.id, "typing");

		const resultUrls = await messageProcessing(urls, ctx);

		const text = ctx.message.text ?? ctx.message.caption;
		const response = generateResponse(text, resultUrls);

		if (response) {
			ctx.replyWithHTML(response, {
				reply_to_message_id: ctx.message.message_id,
			});
		}
	});

type Url = {
	url: string;
	origin: string;
};

function generateResponse(text: string, urls: Url[]) {
	let response = text;

	for (const { url, origin } of urls) {
		if ([".mp4", ".jpg", ".png"].includes(url.substring(url.length - 4))) {
			continue;
		}

		response = response.replaceAll(
			origin,
			`<a href='${url}'>${origin}${origin.includes(url) ? "" : "[*]"}</a>`,
		);
	}

	return response;
}

async function messageProcessing(detected_urls: string[], ctx: Context) {
	const uniqueUrls = [...new Set(detected_urls)];
	const urls: Url[] = [];

	for (let l_ind = 0; l_ind < uniqueUrls.length; ++l_ind) {
		const origin = uniqueUrls[l_ind];
		const link = processURL(origin);

		const art: Article = await findArticle(link);
		if (art) {
			urls.push({
				url: art.telegraphUrl[0],
				origin,
			});
		} else {
			if (
				!link.includes("telegra.ph") &&
				!link.includes("tprg.ru") &&
				!link.includes("tproger.ru")
			) {
				const virtualConsole = new VirtualConsole();

				const document = await fetch(link, {
					method: "GET",
					redirect: "follow",
				}).then((res) => res.text());

				const $ = cheerio.load(document);
				$("div[data-image-src]").replaceWith(function () {
					const src = $(this).attr("data-image-src");
					return `<img src=${src}>`;
				});
				let doc = undefined;
				try {
					doc = new JSDOM($.html(), {
						virtualConsole,
						url: link,
					});
				} catch {
					doc = new JSDOM($.html(), {
						virtualConsole,
					});
				}

				const documentClone = doc.window.document.cloneNode(true);
				if (isProbablyReaderable(documentClone)) {
					const parsed = new Readability(documentClone).parse();
					if (parsed == null) {
						console.log("parsed is null");
						return;
					}

					ctx.api.sendChatAction(ctx.chat.id, "typing");
					const content = parsed.content; //if null try to process directly with cheerio
					const title = parsed.title;

					const $ = cheerio.load(content);
					$.html();
					//todo: if table, transform it to image, upload to telegraph and insert path to it

					const transformed = (await Atransform($("body")[0]))[0];

					// console.log(JSON.stringify(transformed, null, 2));
					const chil = transformed.children.filter(
						(elem) =>
							typeof elem !== "string" ||
							(typeof elem === "string" && elem.replace(/\s/g, "").length > 0),
					);

					const ph = new telegraph();
					const random_token = process.env.TELEGRAPH_TOKEN;
					let telegraf_links = Array<string>();

					const article_parts = splitArray(chil, link);
					// console.log(JSON.stringify(article_parts, null, 2));
					const parts_url = await createPages(
						article_parts,
						random_token,
						title,
						ph,
					);
					addPrevNext(parts_url, random_token, title, ph);

					telegraf_links = parts_url;

					await createArticle(link, telegraf_links);

					urls.push({
						url: telegraf_links[0],
						origin,
					});
				}
			}
		}
		if (urls.length < l_ind + 1) {
			// link can't be transformed
			urls.push({ url: link, origin });
		}
	}
	return urls;
}
