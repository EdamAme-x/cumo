import { Hono } from "@hono/hono";
import type { Env, BlankSchema } from "@hono/hono/types";

export const BASE_CONFIG = {
  basePath: "/",
  notFoundPattern: "not-found",
  serverErrorPattern: "error",
  strict: false,
} satisfies Partial<ServerConfig>;

export interface ServerConfig<E extends Env = any, B extends string = "/">
  extends NonNullable<ConstructorParameters<typeof Hono>[0]> {
  baseApp?: Hono<E, BlankSchema, B>;
  basePath?: B;
  notFoundPattern?: string;
  serverErrorPattern?: string;
  baseDir: string;
}

export interface InternalServerConfig<
  E extends Env = any,
  B extends string = "/",
> extends ServerConfig<E, B> {
  baseApp: Hono<E, BlankSchema, B>;
  basePath: B;
  notFoundPattern: string;
  serverErrorPattern: string;
  strict: boolean;
}
