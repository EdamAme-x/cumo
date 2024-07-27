import { Hono } from "@hono/hono";
import {
  BASE_CONFIG,
  type InternalServerConfig,
  type ServerConfig,
} from "./server-config.ts";
import type { Env, BlankSchema } from "@hono/hono/types";
import { createRoutes, getRoutes } from "./utils/create-routes.ts";
import { join } from "node:path";

/**
 * @description Server Handler of Cumo
 *
 * @param serverConfig Server Config
 * @param serverConfig.basePath Base Path (default: '/')
 * @param serverConfig.baseApp Base Hono App
 * @param serverConfig.baseDir Base Dir (Absolute path) (default: process.cwd())
 * @param serverConfig.extensions Extensions
 * @param serverConfig.notFoundPattern Not Found File Pattern (default: 'not-found')
 * @param serverConfig.serverErrorPattern Server Error File Pattern (default: 'error')
 * @param serverConfig.strict Strict Mode of Hono (default: false)
 * @param serverConfig.router Router of Hono
 * @param serverConfig.getPath Get Path of Hono
 */
export class ServerHandler<E extends Env = any, B extends string = "/"> {
  public hono: Hono<E, BlankSchema, B>;
  private config: InternalServerConfig<E, B>;

  constructor(serverConfig?: ServerConfig<E, B>) {
    let internalServerConfig = {
      ...BASE_CONFIG,
      ...serverConfig,
    } as InternalServerConfig<E, B>;

    for (
      let i = 0, len = internalServerConfig.extensions.length;
      i < len;
      i++
    ) {
      const extension = internalServerConfig.extensions[i];
      if (extension.bootstrap) {
        extension.bootstrap(internalServerConfig);
      }
    }

    this.hono =
      internalServerConfig.baseApp ||
      new Hono<E, BlankSchema, B>({
        strict: internalServerConfig.strict,
        router: internalServerConfig.router,
        getPath: internalServerConfig.getPath,
      });

    if (internalServerConfig.basePath) {
      this.hono = this.hono.basePath(internalServerConfig.basePath);
    }

    for (
      let i = 0, len = internalServerConfig.extensions.length;
      i < len;
      i++
    ) {
      const extension = internalServerConfig.extensions[i];
      if (extension.setup) {
        extension.setup(this.hono);
      }
    }

    this.config = internalServerConfig;
  }

  public async registerRoutes(rotuesPath: string): Promise<this> {
    const allRoutes = await getRoutes(rotuesPath);
    const routes = createRoutes(allRoutes, this.config, rotuesPath);

    const getModule = async (modulePath: string) => {
      return await ((path: string) => import(path))(
        join(this.config.baseDir, modulePath)
      );
    };

    const registerExtensions = this.config.extensions.filter((extension) => {
      return extension.register;
    });

    for (let i = 0, len = routes.length; i < len; i++) {
      const route = routes[i];

      const module = await getModule(route.modulePath);

      for (let i = 0, len = registerExtensions.length; i < len; i++) {
        const extension = registerExtensions[i];
        extension.register!({
          type: "start",
          ...route,
        });
      }

      if (route.isNotFound) {
        this.hono.notFound((c) => {
          const method = c.req.method;
          if (module[method]) {
            return module[method](c);
          }
          if (module.default) {
            return module.default(c);
          }

          return c.notFound();
        });
      } else if (route.isError) {
        this.hono.onError((err, c) => {
          const method = c.req.method;
          if (module[method]) {
            return module[method](c, err);
          }
          if (module.default) {
            return module.default(c, err);
          }

          return c.notFound();
        });
      } else {
        this.hono.all(route.handlerPath, (c) => {
          const method = c.req.method;

          if (module[method]) {
            return module[method](c);
          }
          if (module.default) {
            return module.default(c);
          }

          return c.notFound();
        });
      }

      for (let i = 0, len = registerExtensions.length; i < len; i++) {
        const extension = registerExtensions[i];
        extension.register!({
          type: "end",
          ...route,
        });
      }
    }

    return this;
  }

  public createHandler(): (
    req: Request,
    ...args: any[]
  ) => Response | Promise<Response> {
    return (req: Request, ...args: any[]) => this.hono.fetch(req, ...args);
  }
}
