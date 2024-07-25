import { type ExecutionContext, Hono } from "@hono/hono";
import { BASE_CONFIG, InternalServerConfig, type ServerConfig } from "./server-config";
import type { Env, BlankSchema } from "@hono/hono/types";
import * as fs from "node:fs";
import { createRoutes, getRoutes } from "./utils/createRoutes";

export class ServerHandler<E extends Env = any, B extends string = "/"> {
  public hono: Hono<E, BlankSchema, B>;
  private config: InternalServerConfig<E, B>;

  constructor(serverConfig: ServerConfig<E, B> = {}) {
    const internalServerConfig = {
      ...BASE_CONFIG,
      ...serverConfig,
    } as InternalServerConfig<E, B>;

    this.hono =
      serverConfig.baseApp ??
      new Hono<E>({
        ...serverConfig,
      });

    if (serverConfig.basePath) {
        this.hono = this.hono.basePath(serverConfig.basePath);
    }

    this.config = internalServerConfig;
  }

  public async registerRoutes(rotuesPath: string) {
    const allRoutes = await getRoutes(rotuesPath);
    const routes = createRoutes(allRoutes, this.config);

    for (let i = 0, len = routes.length; i < len; i++) {
        const route = routes[i];

        if (route.isNotFound) {
            const module = await import(route.modulePath);

            this.hono.notFound((c) => {
                const method = c.req.method;
                if (module[method]) {
                    return module[method](c);
                }
                return module.default(c);
            });
            continue;
        }else if (route.isError) {
            const module = await import(route.modulePath);

            this.hono.onError((err, c) => {
                const method = c.req.method;
                if (module[method]) {
                    return module[method](c, err);
                }
                return module.default(c, err);
            });
            continue;
        }

        const module = await import(route.modulePath);

        this.hono.all(route.handlerPath, (c) => {
            const method = c.req.method;
            if (module[method]) {
                return module[method](c);
            }
            return module.default(c);
        })
    }
  }

  public handler(req: Request, env?: E, executionCtx?: ExecutionContext): Response | Promise<Response> {
    return this.hono.fetch(req, env, executionCtx);
  }
}
