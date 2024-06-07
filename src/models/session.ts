import type { DB } from "@/models/client";
import type { SessionsTable } from "@/models/schema";
import { eq } from "drizzle-orm";
import type { StorageAdapter } from "grammy";

export interface Session {
	key: string;
	value: string;
}

export class DrizzleAdapter<T> implements StorageAdapter<T> {
	private sessionDelegate: DB;
	private sessionTable: SessionsTable;

	constructor(repository: DB, table: SessionsTable) {
		this.sessionDelegate = repository;
		this.sessionTable = table;
	}

	async read(key: string) {
		const [session] = await this.sessionDelegate
			.select({ value: this.sessionTable.value })
			.from(this.sessionTable)
			.where(eq(this.sessionTable.key, key))
			.limit(1);

		return session?.value ? (JSON.parse(session.value) as T) : undefined;
	}

	async write(key: string, data: T) {
		const value = JSON.stringify(data);

		await this.sessionDelegate
			.insert(this.sessionTable)
			.values({ key, value })
			.onConflictDoUpdate({
				target: this.sessionTable.key,
				set: { value },
			});
	}

	async delete(key: string) {
		await this.sessionDelegate
			.delete(this.sessionTable)
			.where(eq(this.sessionTable.key, key));
	}
}
