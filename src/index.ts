import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
  .use(swagger({
    scalarConfig: {
      theme: 'solarized'
    }
  }))
  .group('/api', (app) =>
    app.get('/', () => {
      return "Hello World!"
    })
  )
  .listen(process.env.PORT ?? 3002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
