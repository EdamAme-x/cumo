import type { Extension } from "../../runtime/server/server-config.ts";
import { Hono } from "@hono/hono";

const css =
  '*,*::before,*::after{box-sizing:border-box}body,h1,h2,h3,h4,p,figure,blockquote,dl,dd{margin:0}ul[role="list"],ol[role="list"]{list-style:none}html:focus-within{scroll-behavior:smooth}body{min-height:100vh;text-rendering:optimizeSpeed;line-height:1.5}a:not([class]){text-decoration-skip-ink:auto}img,picture{max-width:100%;display:block}input,button,textarea,select{font:inherit}@media(prefers-reduced-motion:reduce){html:focus-within{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;scroll-behavior:auto !important}}';

/**
 * @description Reset CSS Extension
 *
 * @param options.path Patch path of reset-css
 */
export function ResetCSS(options?: { path?: string }): Extension {
  const { path = "*" } = options || {};

  return {
    setup(hono: Hono) {
      hono.use(path, async (c, next) => {
        await next();
        if (c.req.method === "GET") {
          const contentType = c.res.headers.get("content-type");
          if (contentType && contentType.includes("text/html")) {
            c.res = new Response(
              `<style cumo-reset-css>${css}</style>${await c.res.text()}`,
              {
                headers: c.res.headers,
                status: c.res.status,
                statusText: c.res.statusText,
              }
            );
          }
        }
      });
    },
  };
}
