import type { Extension } from "../../runtime/server/server-config.ts";
import { Hono } from '@hono/hono';

/**
 * @description Hot Reload Extension, Please lunch script in watch mode.
 */
export const HotReload: Extension = {
    setup(hono: Hono) {
        const id = Math.random().toString(36).slice(2);
        hono.get("/_cumo/hot-reload/id", async (c) => {
            return c.text(id);
        });
    },
};
