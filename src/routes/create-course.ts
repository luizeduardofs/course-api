import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema/courses.ts";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Create a course",
        description: "This route receive a title and create a course",
        body: z.object({
          title: z.string(),
          description: z.string().nullable(),
        }),
        response: {
          201: z
            .object({ courseId: z.uuid() })
            .describe("Successfully create a course"),
        },
      },
    },
    async (request, replay) => {
      const body = request.body;

      const result = await db
        .insert(courses)
        .values({
          title: body.title,
          description: body.description,
        })
        .returning();

      return replay.status(201).send({ courseId: result[0].id });
    }
  );
};
