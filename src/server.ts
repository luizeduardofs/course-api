import { app } from "./app.ts";

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running");
});
