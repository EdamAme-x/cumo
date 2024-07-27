import type { Extension } from "../../runtime/server/server-config.ts";
import type { Route } from "../../runtime/server/utils/create-routes.ts";

const logMap = new Map();
const floor = (n: number) => Math.floor(n * 100) / 100;

/**
 * @description Register-Log Extension
 *
 * @param options.path Patch path of powered-by
 */
export function RegisterLog(handler?: registerHandler): Extension {
  return {
    register(route) {
      const currentTime = performance.now();

      if (route.type === "end") {
        if (logMap.has(route.handlerPath + route.modulePath)) {
          const startTime = logMap.get(route.handlerPath + route.modulePath);

          if (handler) {
            handler("end", route, currentTime);
          } else {
            console.log(
              `[${route.handlerPath}]: \x1b[32mregistered in \x1b[0m\x1b[33m${Math.max(0, floor(currentTime - startTime))}ms\x1b[0m`
            );
          }
        }
      }

      if (route.type === "start") {
        logMap.set(route.handlerPath + route.modulePath, currentTime);
        if (handler) {
          handler("start", route, currentTime);
        } else {
          console.log(`[${route.handlerPath}]: \x1b[32mregistering...\x1b[0m`);
        }
      }
    },
  };
}

interface registerHandler {
  (type: "start", route: Route, startTime: number): void;
  (type: "end", route: Route, endTime: number): void;
}
