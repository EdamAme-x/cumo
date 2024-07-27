import type { JSXNode } from "@hono/hono/jsx";
import type { CumoContext } from "../../../packages/runtime/mod";

export default function Layout(children: JSXNode, c: CumoContext) {
    return <html>
        <head>
            <title>Cumo</title>
        </head>
        <body>
            {children}
        </body>
    </html>
}