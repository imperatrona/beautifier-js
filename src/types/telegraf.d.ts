import I18N from "telegraf-i18n";
import { Middleware } from "telegraf";
import { Chat } from "@/models/client";

declare module "telegraf" {
  export class Context {
    dbchat: Chat;
    i18n: I18N;
  }

  export interface Composer<C extends Context> {
    action(
      action: string | string[] | RegExp,
      middleware: Middleware<C>,
      ...middlewares: Array<Middleware<C>>
    ): Composer<C>;
  }
}
