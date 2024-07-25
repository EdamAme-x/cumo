import { Context } from "@hono/hono";

export function GET(c: Context) {
    return c.text("Hello, World! from sub/index.ts");
}