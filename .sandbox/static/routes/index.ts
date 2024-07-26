import type { Context } from "@hono/hono";

export default function Index(c: Context) {
    return c.text("Hello, World! from index.ts");
}