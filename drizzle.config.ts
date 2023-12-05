import "dotenv/config";
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/models/schema.ts",
  out: "./drizzle/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: process.env.SQLITE ?? "data.db",
  },
} satisfies Config;
