import { verify } from "argon2";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../database/client.ts";
import { users } from "../database/schema/users.ts";

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/sessions",
    {
      schema: {
        tags: ["auth"],
        summary: "Login",
        description: "This route make the login",
        body: z.object({
          email: z.email(),
          password: z.string(),
        }),
        response: {
          200: z
            .object({ token: z.string() })
            .describe("Successfully create a login"),
          400: z
            .object({ message: z.string() })
            .describe("Error create a login"),
        },
      },
    },
    async (request, replay) => {
      const { email, password } = request.body;

      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (result.length === 0)
        return replay.status(400).send({ message: "Invalid credentials" });

      const user = result[0];

      const doesPasswordsMatch = await verify(user.password, password);

      if (!doesPasswordsMatch)
        return replay.status(400).send({ message: "Invalid credentials" });

      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be set");

      const token = jwt.sign(
        { sub: user.id, role: user.role },
        process.env.JWT_SECRET
      );

      return replay.status(200).send({ token });
    }
  );
};
