import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["student", "manager"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: userRole().notNull().default("student"),
});
