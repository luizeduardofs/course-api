import request from "supertest";
import { expect, it } from "vitest";
import { app } from "../app.ts";
import { makeUser } from "../tests/factories/make-user.ts";

it("Should create a login", async () => {
  await app.ready();

  const { user, passwordBeforeHash } = await makeUser();

  const response = await request(app.server)
    .post("/sessions")
    .set("Content-Type", "application/json")
    .send({
      email: user.email,
      password: passwordBeforeHash,
    });

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    message: "OK",
  });
});
