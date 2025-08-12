import { fastify } from "fastify";

const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running");
});
