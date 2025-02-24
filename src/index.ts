import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { customerRoutes } from "./routes/customerRoutes";
import { connectDB } from "./db/connection";

connectDB().then(() => {
  const app = new Elysia()
    .use(swagger({
      scalarConfig: {
        theme: 'solarized'
      }
    }))
    .group('/api', (app) =>
      app
        .use(customerRoutes)
    )
    .listen(process.env.PORT ?? 3002);

  console.log(
    `🚀 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
});
