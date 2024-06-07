import type { I18nFlavor } from "@grammyjs/i18n";
import type { ParseModeFlavor } from "@grammyjs/parse-mode";
import type { Context as CTX, SessionFlavor } from "grammy";

export interface SessionData {
	__language_code?: string;
	interactive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type Context = ParseModeFlavor<CTX> &
	SessionFlavor<SessionData> &
	I18nFlavor;
