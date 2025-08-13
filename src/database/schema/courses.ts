import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull().unique(),
  description: text(),
});
