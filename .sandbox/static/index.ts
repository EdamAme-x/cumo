import { Hono } from "@hono/hono";
import { Cumo } from "../../packages/runtime/mod";
import { HotReload } from './../../packages/extensions/hot-reload/mod';
import { PoweredBy } from './../../packages/extensions/powered-by/mod';
import { serveStatic } from '@hono/hono/bun';
import { ResetCSS } from './../../packages/extensions/reset-css/mod';

const app = new Cumo({
    extensions: [
        ResetCSS(),
        HotReload({
            dev: Bun.argv[2] === "--dev",
        }),
        PoweredBy(),
    ],
});

await app.registerRoutes("./routes");

const instance = new Hono();

instance.get("/raw", (c) => {
    return c.text("Hello, World!");
});

app.registerInstance("/", instance);

app.hono.use(serveStatic({
    root: "./public",
}))

Bun.serve({ port: 3000, fetch: app.createHandler() });
