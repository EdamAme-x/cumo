import { type ExecutionContext, Hono } from "@hono/hono";
import { BASE_CONFIG, InternalServerConfig, type ServerConfig } from "./server-config";
import type { Env, BlankSchema } from "@hono/hono/types";
import { createRoutes, getRoutes } from "./utils/createRoutes";
import { join } from "path";

export class ServerHandler<E extends Env = any, B extends string = "/"> {
  public hono: Hono<E, BlankSchema, B>;
  private config: InternalServerConfig<E, B>;

  constructor(serverConfig: ServerConfig<E, B> = {
    baseDir: process.cwd(),
  }) {
    const internalServerConfig = {
      ...BASE_CONFIG,
      ...serverConfig,
    } as InternalServerConfig<E, B>;

    this.hono =
      serverConfig.baseApp ||
      new Hono<E, BlankSchema, B>({
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

    const getModule = async (modulePath: string) => {
        return await import(join(this.config.baseDir, modulePath));
    }

    for (let i = 0, len = routes.length; i < len; i++) {
        const route = routes[i];

        if (route.isNotFound) {
            const module = await getModule(route.modulePath);

            this.hono.notFound((c) => {
                const method = c.req.method;
                if (module[method]) {
                    return module[method](c);
                }
                return module.default(c);
            });
            continue;
        }else if (route.isError) {
            const module = await getModule(route.modulePath);

            this.hono.onError((err, c) => {
                const method = c.req.method;
                if (module[method]) {
                    return module[method](c, err);
                }
                return module.default(c, err);
            });
            continue;
        }

        const module = await getModule(route.modulePath);

        this.hono.all(route.handlerPath, (c) => {
            const method = c.req.method;
            if (module[method]) {
                return module[method](c);
            }
            return module.default(c);
        })
    }
  }

  public createHandler() {
    return (req: Request, ...args: any[]) => this.hono.fetch(req, ...args);
  }
}
