import { faker } from "@faker-js/faker";
import request from "supertest";
import { expect, it } from "vitest";
import { app } from "../app.ts";

it("Should create a course", async () => {
  await app.ready();

  const response = await request(app.server)
    .post("/courses")
    .set("Content-Type", "application/json")
    .send({
      title: faker.lorem.words(2),
      description: faker.lorem.words(4),
    });

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    courseId: expect.any(String),
  });
});
