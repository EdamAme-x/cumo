import { Cumo } from "../../packages/runtime/mod";

const s = new Cumo();

s.hono.get("/raw", (c) => {
    return c.text("Hello, World!");
});

await s.registerRoutes("./routes");

console.log(s.hono.routes)

Bun.serve({ port: 3000, fetch: s.createHandler() });
