import { randomUUID } from "node:crypto";
import request from "supertest";
import { expect, it } from "vitest";
import { app } from "../app.ts";
import { makeCourses } from "../tests/factories/make-courses.ts";

it("Should get all courses", async () => {
  await app.ready();

  const titleId = randomUUID();

  await makeCourses(titleId);

  const response = await request(app.server).get(`/courses?search=${titleId}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: expect.any(Number),
    courses: [
      {
        id: expect.any(String),
        title: titleId,
        description: expect.any(String),
        enrollments: expect.any(Number),
      },
    ],
  });
});
