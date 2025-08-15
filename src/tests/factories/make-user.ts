import { faker } from "@faker-js/faker";
import { hash } from "argon2";
import { randomUUID } from "node:crypto";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema/users.ts";

export async function makeUser() {
  const passwordBeforeHash = randomUUID();

  const result = await db
    .insert(users)
    .values([
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hash(passwordBeforeHash),
        role: "student",
      },
    ])
    .returning();

  return {
    user: result[0],
    passwordBeforeHash,
  };
}
