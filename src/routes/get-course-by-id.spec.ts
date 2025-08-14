// import { randomUUID } from "node:crypto";
import request from "supertest";
import { expect, it } from "vitest";
import { app } from "../app.ts";
import { makeCourses } from "../tests/factories/make-courses.ts";

it("Should get course by ID", async () => {
  await app.ready();

  const course = await makeCourses();

  const response = await request(app.server).get(`/courses/${course.id}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    courses: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
    },
  });
});

// it("Should return 404 status if non existing courses", async () => {
//   await app.ready();

//   const id = randomUUID();

//   const response = await request(app.server).get(`/courses/${id}`);

//   expect(response.status).toEqual(404);
// });
