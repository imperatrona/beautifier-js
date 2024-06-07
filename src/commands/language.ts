import type { Context } from "@/context";
import { Composer, InlineKeyboard } from "grammy";
import type { InlineKeyboardButton } from "grammy/types";
import { readFileSync, readdirSync } from "node:fs";

type Locale = {
	code: string;
	name: string;
};

const localNameRe = /^name = (.+)$/m;
const localesPath = "./locales";

const locales: Locale[] = readdirSync(localesPath).map((localeFile) => ({
	code: localeFile.split(".")[0],
	name: localNameRe.exec(
		readFileSync(`${localesPath}/${localeFile}`, "utf8"),
	)[1],
}));

const result: InlineKeyboardButton[][] = [];

locales.forEach(({ name, code }, index) => {
	const key = InlineKeyboard.text(name, code);

	if (index === 0) {
		result.push([key]);
	} else if (index % 2 === 0) {
		result.at(-1).push(key);
	} else {
		result.at(-1).push(key);
		if (index < locales.length - 1) {
			result.push([]);
		}
	}
});

const localesKeyboard = InlineKeyboard.from(result);

export const language = new Composer<Context>();

language.command("language", async (ctx) => {
	await ctx.reply(ctx.t("language"), {
		reply_markup: localesKeyboard,
	});
});

language.callbackQuery(
	locales.map((locale) => locale.code),
	async (ctx) => {
		const languageCode = ctx.callbackQuery.data;

		await ctx.i18n.setLocale(languageCode);
		ctx.session.updatedAt = new Date();

		await ctx.editMessageText(ctx.t("language_selected"), {
			parse_mode: "HTML",
		});
	},
);
