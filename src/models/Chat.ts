import { eq, sql } from "drizzle-orm";
import { db } from "./client";
import { chats } from "./schema";

export async function findChat(id: number) {
  let chat = await db.query.chats.findFirst({
    where: eq(chats.chatId, id),
  });
  if (!chat) {
    try {
      chat = (
        await db
          .insert(chats)
          .values({
            chatId: id,
          })
          .returning()
      )[0];
    } catch (err) {
      chat = await db.query.chats.findFirst({
        where: eq(chats.chatId, id),
      });
    }
  }
  return chat;
}

export async function switchInteractive(id: number, value: boolean) {
  return (
    await db
      .update(chats)
      .set({ interactive: !value })
      .where(eq(chats.chatId, id))
      .returning()
  )[0];
}

export async function changeLanguage(id: number, language: string) {
  return (
    await db
      .update(chats)
      .set({ language: language })
      .where(eq(chats.chatId, id))
      .returning()
  )[0];
}

export async function deleteChat(id: number) {
  await db.delete(chats).where(eq(chats.chatId, id));
}

export async function findAllChats() {
  return await db.select().from(chats);
}

export async function countChats() {
  const count = await db
    .select({
      count: sql`count() as count`,
    })
    .from(chats);

  return count[0].count;
}
