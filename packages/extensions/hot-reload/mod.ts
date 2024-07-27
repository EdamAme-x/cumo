import type { Extension } from "../../runtime/server/server-config.ts";
import { Hono } from "@hono/hono";

/**
 * @description Hot Reload Extension, Please lunch script in watch mode.
 *
 * @param options.interval Interval of detect change
 * @param options.dev Development mode (Please set false in production by args (e.x. --dev))
 */
export function HotReload(options?: {
  interval?: number;
  dev: boolean;
}): Extension {
  const { interval = 500, dev = true } = options || {};

  return {
    setup(hono: Hono) {
      if (!dev) return;

      const id = Math.random().toString(36).slice(2);
      hono.get("/_cumo/extensions/hot-reload", async (c) => {
        return c.text(id);
      });

      const script = `<script cumo-hot-reload>setInterval(()=>{fetch('/_cumo/extensions/hot-reload').then(r=>r.text()).then(i=>{if(i!=='${id}')location.reload()})},${interval + 4})</script>`;
      hono.use("*", async (c, next) => {
        await next();
        if (c.req.method === "GET") {
          const contentType = c.res.headers.get("content-type");
          if (contentType && contentType.includes("text/html")) {
            c.res = new Response(`${await c.res.text()}${script}`, {
              headers: c.res.headers,
              status: c.res.status,
              statusText: c.res.statusText,
            });
          }
        }
      });
    },
  };
}
