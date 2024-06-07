import "module-alias/register";

import * as dotenv from "dotenv";
dotenv.config();

import { beautify } from "@/commands/beautify";
import { help } from "@/commands/help";
import { language } from "@/commands/language";
import type { Context, SessionData } from "@/context";
import { db } from "@/models/client";
import { sessions } from "@/models/schema";
import { DrizzleAdapter } from "@/models/session";
import { I18n } from "@grammyjs/i18n";
import { hydrateReply } from "@grammyjs/parse-mode";
import { Bot, session } from "grammy";

const bot = new Bot<Context>(process.env.TOKEN);

bot.use(
	session({
		initial: () => ({
			__language_code: "en",
			interactive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		}),
		storage: new DrizzleAdapter<SessionData>(db, sessions),
	}),
);

bot.use(
	new I18n<Context>({
		defaultLocale: "en",
		directory: "./locales",
		useSession: true,
	}),
);
bot.use(hydrateReply);

bot.use(help);
bot.use(language);
bot.use(beautify);

bot.start({ onStart: () => console.info("Bot is up and running") });
