import type { Context } from "@hono/hono";

export function GET(c: Context) {
    return c.html(<>
        <h1>Hello, World! from [id]/index.ts</h1>
        <p>id: {c.req.param("id")}</p>    
    </>);
}