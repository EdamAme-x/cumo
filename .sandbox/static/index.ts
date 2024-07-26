import { Cumo } from "../../packages/runtime/mod";
import { HotReload } from './../../packages/extensions/hot-reload/mod';

const s = new Cumo({
    extensions: [
        HotReload({
            dev: Bun.argv[2] === "--dev",
        })
    ],
});

s.hono.get("/raw", (c) => {
    return c.text("Hello, World!");
});

await s.registerRoutes("./routes");

console.log(s.hono.routes)

Bun.serve({ port: 3000, fetch: s.createHandler() });
