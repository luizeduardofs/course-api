import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z, { uuid } from "zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema/courses.ts";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Get course by ID",
        description: "This route return a course using a specific ID",
        params: z.object({
          id: uuid(),
        }),
        response: {
          200: z
            .object({
              courses: z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
              }),
            })
            .describe("Successfully to return a single course"),
          404: z.null().describe("Course not found"),
        },
      },
    },
    async (request, replay) => {
      const courseId = request.params.id;

      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      return replay.send({ courses: result[0] });
    }
  );
};
