import { ServerHandler } from "../../packages/runtime/server/handler";

const s = new ServerHandler();

await s.registerRoutes("./routes");

s.hono.get("/raw", (c) => {
    return c.text("Hello, World!");
});

console.log(s.hono.routes)

Bun.serve({ port: 3000, fetch: s.createHandler() });