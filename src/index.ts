import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { customerRoutes } from "./routes/customerRoutes";
import { connectDB } from "./db/connection";
import { cors } from '@elysiajs/cors'

connectDB().then(() => {
  const app = new Elysia()
    .use(cors())
    .use(swagger({
      theme: 'light',
      scalarConfig: {
        theme: 'solarized'
      }
    }))
    .group('/api', (app) =>
      app
        .use(customerRoutes)
    )
    .listen(process.env.PORT ?? 3000);

  console.log(
    `🚀 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
});
