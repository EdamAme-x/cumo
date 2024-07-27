import type { Extension } from "../../runtime/server/server-config.ts";

/**
 * @description Powered-By Extension
 *
 * @param options.path Patch path of powered-by
 */
export function PoweredBy(options?: { path: string }): Extension {
  const { path = "*" } = options || {};

  return {
    setup(hono) {
      hono.use(path, async (c, next) => {
        await next();
        c.res.headers.set("X-Powered-By", "Cumo");
      });
    },
  };
}
