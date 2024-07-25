import { ServerHandler } from "../../packages/runtime/server/handler";

const s = new ServerHandler();

s.registerRoutes("./routes");

s.hono.get("/raw", (c) => {
    return c.text("Hello, World!");
});

Bun.serve({ port: 3000, fetch: s.createHandler() });
