<a href='https://t.me/BeautifierRebornBot'>@BeautifierRebornBot</a>

# Telegram bot which transforms any link in Instant View

Tired of slow web pages full of ads? Wouldn't be better if all links were **Instant View's**?. Well, this <b>Bot</b> can transform almost any link into an Instant View, keeping only meaningful information, **just forward a link to it**. If you add the bot to a group, it will try to transform any encountered link into an Instant View.
It uses Mozilla's Readability Tool for extracting web content and https://telegra.ph/ to host that new content.

_Just remember, Readability and Telegraph are not perfect. Readability **can skip some images/videos**. Telegraph **can't handle tables**. For those cases, each Telegraph article have link to original article in order to quickly switch to original web page._

Hopefully these drawbacks will be solved in the future by using Chrome's Readability engine and by generating images of tables for telegraph.

# Installation and local launch

1. Clone this repo: `git clone https://github.com/imperatrona/Beautifier`
2. Create `.env` with the environment variables listed below
3. Run `npm install` in the root folder
4. Run `npm run migrate`
5. Run `npm run develop`

And you should be good to go! Feel free to fork and submit pull requests. Thanks!

# Environment variables

- `TOKEN` — Telegram bot token
- `TELEGRAPH_TOKEN`— Token for creating Telegraph pages. You can get it by calling appropiate API
- `SQLITE`— URL of the mongo database

Also, please, consider looking at `.env.sample`.

# License

MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!

Based on: https://github.com/backmeupplz/telegraf-template
