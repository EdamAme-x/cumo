import { Hono } from "@hono/hono";
import type { Env, BlankSchema, BlankEnv } from "@hono/hono/types";
import { default as _process } from "node:process";
import type { Route } from "./utils/create-routes.ts";

export const BASE_CONFIG = {
  basePath: "/",
  notFoundPattern: "not-found",
  serverErrorPattern: "error",
  strict: false,
  baseDir: _process.cwd(),
  extensions: [],
} satisfies Partial<ServerConfig<Env, "/">>;

export interface ServerConfig<E extends Env, B extends string>
  extends NonNullable<ConstructorParameters<typeof Hono>[0]> {
  baseApp?: Hono<E, BlankSchema, B>;
  basePath?: B;
  notFoundPattern?: string;
  serverErrorPattern?: string;
  baseDir?: string;
  extensions?: Extension<E, B>[];
}

export interface InternalServerConfig<E extends Env, B extends string>
  extends Required<ServerConfig<E, B>> {}

export type Extension<E extends Env = BlankEnv, B extends string = "/"> = {
  bootstrap?: (config: InternalServerConfig<E, B>) => void;
  setup?: (hono: Hono<E, BlankSchema, B>) => void;
  register?: (
    route: {
      type: "start" | "end";
    } & Route
  ) => void;
};
