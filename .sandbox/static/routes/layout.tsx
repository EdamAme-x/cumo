import type { JSXNode } from "@hono/hono/jsx";
import type { CumoContext } from "../../../packages/runtime/mod";
import { Style } from "hono/css";
import { BodyCSS } from "../styles/global";

export default function Layout(children: JSXNode, c: CumoContext) {
  return (
    <html>
      <head lang="en">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cumo-App "{c.req.path}"</title>
        <meta name="description" content="Cumo-App" />
        <link rel="icon shortcut" href="/favicon.png" />
        <link rel="stylesheet" href="/global.css" />
        <Style />
      </head>
      <body class={BodyCSS}>{children}</body>
    </html>
  );
}
