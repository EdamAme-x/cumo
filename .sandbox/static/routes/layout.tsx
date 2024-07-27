import type { JSXNode } from "@hono/hono/jsx";
import type { CumoContext } from "../../../packages/runtime/mod";

export default function Layout(children: JSXNode, c: CumoContext) {
    return <html>
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Cumo-App "{c.req.path}"</title>
            <meta name="description" content="Cumo-App" />
            <link rel="icon shortcut" href="/favicon.png" />
            <link rel="apple-touch-icon" href="/favicon.png" />
        </head>
        <body>
            {children}
        </body>
    </html>
}