import type { Context } from "@hono/hono";

export default function NotFound(c: Context) {
    return c.text("Hello, World! from not-found.ts");
}