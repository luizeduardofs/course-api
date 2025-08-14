import { and, asc, count, eq, ilike, SQL } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema/courses.ts";
import { enrollments } from "../database/schema/enrollments.ts";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Get all course",
        description: "This route return all course",
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(["title"]).optional().default("title"),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z.object({
            courses: z.array(
              z
                .object({
                  id: z.uuid(),
                  title: z.string(),
                  description: z.string().nullable(),
                  enrollments: z.number(),
                })
                .describe("Successfully to return all course")
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, replay) => {
      const { search, orderBy, page } = request.query;
      const conditions: SQL[] = [];

      if (search) conditions.push(ilike(courses.title, `%${search}%`));

      const [result, total] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            description: courses.description,
            enrollments: count(enrollments.id),
          })
          .from(courses)
          .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
          .orderBy(asc(courses[orderBy]))
          .limit(20)
          .offset((page - 1) * 2)
          .where(and(...conditions))
          .groupBy(courses.id),

        db.$count(courses, and(...conditions)),
      ]);

      return replay.send({ courses: result, total });
    }
  );
};
