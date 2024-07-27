import type { Context } from "@hono/hono";
import { type JSXNode } from "@hono/hono/jsx";

export function createResponse(value: CumoResponse): Response {
  if (value instanceof Response) {
    return value;
  }
  return new Response(String(value));
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
  | (any[] | Record<string, any>)
  | (null | undefined);

export type CumoResponse = SyncCumoResponse | Promise<SyncCumoResponse>;

export type CumoContext = Context & {
  rawContext: Context;
  page: (jsx: JSXNode) => JSXNode;
};
