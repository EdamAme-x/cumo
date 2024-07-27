import type { Context } from "@hono/hono";
import { type JSXNode } from "@hono/hono/jsx";

export async function createResponse(
  value: CumoResponse,
  c: CumoContext
): Promise<Response> {
  value = await value;

  if (value instanceof Response) {
    return value;
  }

  if (!value) {
    return c.notFound();
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return new Response(String(value), {
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  if (Array.isArray(value)) {
    return new Response(JSON.stringify(value), {
      headers: {
        "content-type": "application/json",
      },
    });
  }

  if (typeof value === "object") {
    return c.render(value.toString());
  }

  return c.notFound();
}

export function createContext(c: Context): CumoContext {
  return Object.assign(c, {
    rawContext: c,
    page: (jsx: JSXNode) => jsx,
  });
}

type SyncCumoResponse =
  | Response
  | JSXNode
  | (string | number | boolean)
  | (null | undefined);

export type CumoResponse = SyncCumoResponse | Promise<SyncCumoResponse>;

export type CumoContext = Context & {
  rawContext: Context;
  page: (jsx: JSXNode) => JSXNode;
};
