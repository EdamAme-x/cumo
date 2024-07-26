import type { Context } from "@hono/hono";

export function POST(c: Context) {
    return c.text("Hello, World! from sub.ts:POST");
}