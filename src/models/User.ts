import { eq } from "drizzle-orm";
import { db } from "./client";
import { users } from "./schema";

export async function findUser(id: number) {
  let user = await db.query.users.findFirst({
    where: eq(users.userId, id),
  });
  if (!user) {
    try {
      user = (
        await db
          .insert(users)
          .values({
            userId: id,
          })
          .returning()
      )[0];
    } catch (err) {
      user = await db.query.users.findFirst({
        where: eq(users.userId, id),
      });
    }
  }
  return user;
}
