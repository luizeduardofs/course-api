import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema/courses.ts";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Get all course",
        description: "This route return all course",
        response: {
          200: z.object({
            courses: z.array(
              z
                .object({
                  id: z.uuid(),
                  title: z.string(),
                  description: z.string().nullable(),
                })
                .describe("Successfully to return all course")
            ),
          }),
        },
      },
    },
    async (_, replay) => {
      const result = await db.select().from(courses);

      return replay.send({ courses: result });
    }
  );
};
