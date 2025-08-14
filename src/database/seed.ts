import { fakerPT_BR as faker } from "@faker-js/faker";
import { db } from "./client.ts";
import { courses } from "./schema/courses.ts";
import { enrollments } from "./schema/enrollments.ts";
import { users } from "./schema/users.ts";

async function seed() {
  const usersInsert = await db
    .insert(users)
    .values([
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    ])
    .returning();

  const coursesInsert = await db
    .insert(courses)
    .values([
      {
        title: faker.lorem.words(2),
        description: faker.lorem.words(5),
      },
      {
        title: faker.lorem.words(2),
        description: faker.lorem.words(5),
      },
    ])
    .returning();

  await db.insert(enrollments).values([
    {
      courseId: coursesInsert[0].id,
      userId: usersInsert[0].id,
    },
    {
      courseId: coursesInsert[0].id,
      userId: usersInsert[1].id,
    },
    {
      courseId: coursesInsert[1].id,
      userId: usersInsert[2].id,
    },
  ]);
}

seed();
