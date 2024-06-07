import type { Context } from "@/context";
import { Composer } from "grammy";

export const help = new Composer<Context>();

help.command(["help", "start"], async (ctx) => {
	ctx.replyWithHTML(ctx.t("help"));
});
