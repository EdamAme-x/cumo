import type { Extension } from "../../runtime/server/server-config.ts";

export function PoweredBy(): Extension {
    return ({
        setup(hono) {
            hono.use("*", async (c, next) => {
                await next();
                c.res.headers.set("X-Powered-By", "Cumo");
            });
        },
    })
}