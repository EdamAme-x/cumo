import type { InternalServerConfig } from "../server-config.ts";
import { join } from "node:path";
import * as fs from "node:fs";

const EXTENSIONS = ["ts", "tsx", "js", "jsx"];

function filterRoutes(routes: string[]): string[] {
  return routes.filter((route) => {
    return EXTENSIONS.some((ext) => route.endsWith("." + ext));
  });
}

function normlizePath(path: string, sameDir = true): string {
  return (sameDir ? "./" : "") + path.replace(/\\/g, "/");
}

const REGEXP_NO_ROUTE = /^\([a-zA-Z0-9-_]+\)$/;
const REGEXP_PARAM_ROUTE = /^\[[a-zA-Z0-9-_]+\]$/;
const REGEXP_ALL_ROUTE = /^\[\.\.\.[a-zA-Z0-9-_]+\]$/;

const REGEXP_INDEX_ROUTE = new RegExp(`^index\.[a-zA-Z0-9-_]+$`);
const REGEXP_EXT_ROUTE = new RegExp(`\.[a-zA-Z0-9-_]+$`);

function parseHandlerPath<B extends string>(parentPath: string, routeName: string, config: InternalServerConfig<any, B>): string {
  const parsedParentPath = parentPath
    .split("/")
    .map((dirName) => {
      if (REGEXP_NO_ROUTE.test(dirName)) {
        return null;
      }

      const matchParam = dirName.match(REGEXP_PARAM_ROUTE);

      if (matchParam && matchParam.input) {
        return ":" + matchParam.input.replace(/\[|\]/g, "");
      }

      if (REGEXP_ALL_ROUTE.test(dirName)) {
        return "*";
      }

      return dirName;
    })
    .filter((dirName) => dirName !== null);

  const parsedRouteName = routeName
    .replace(REGEXP_INDEX_ROUTE, "")
    .replace(REGEXP_EXT_ROUTE, "")
    .replace(new RegExp(`^${config.layoutPattern}$`), "*");

  const handlerPath = [
    ...parsedParentPath,
    parsedParentPath[parsedParentPath.length - 1] === "*"
      ? null
      : parsedRouteName === ""
        ? null
        : parsedRouteName,
  ]
    .filter((path) => path !== null)
    .join("/");

  return handlerPath || "/";
}

function getPathData(path: string) {
  const [fileName, ...parentPath] = path.split("/").reverse();

  return {
    parentPath: parentPath.reverse().join("/"),
    fileName: fileName,
  };
}

export function createRoutes<B extends string>(
  routes: string[],
  config: InternalServerConfig<any, B>,
  rotuesPath: string
): Route[] {
  const filteredRoutes = filterRoutes(routes);
  const formattedRoutes = filteredRoutes.map((route) => {
    const { parentPath, fileName } = getPathData(normlizePath(route, false));

    return {
      name: fileName,
      parentPath,
    };
  });

  return sortRoutes(
    formattedRoutes.map((route) => {
      return {
        handlerPath: parseHandlerPath<B>(
          route.parentPath.replace(rotuesPath, ""),
          route.name,
          config
        ),
        modulePath: normlizePath(
          join(normlizePath(route.parentPath, false), route.name)
        ),
        isNotFound: new RegExp(
          `${config.notFoundPattern}\.(${EXTENSIONS.join("|")})$`
        ).test(route.name),
        isError: new RegExp(
          `${config.serverErrorPattern}\.(${EXTENSIONS.join("|")})$`
        ).test(route.name),
        isLayout: new RegExp(
          `${config.layoutPattern}\.(${EXTENSIONS.join("|")})$`
        ).test(route.name),
      };
    })
  );
}

function sortRoutes(routes: Route[]): Route[] {
  const BACK = -1;
  const SAME = 0;
  const FRONT = 1;

  return routes
    .sort(
      (a, b) =>
        b.handlerPath.split("/").length - a.handlerPath.split("/").length
    )
    .sort((a, b) =>
      a.handlerPath.split("/").length === b.handlerPath.split("/").length
        ? (a.handlerPath.split("/").pop() ?? "").startsWith(":")
          ? FRONT
          : SAME
        : SAME
    )
    .sort((a, b) =>
      a.handlerPath.split("/").length === b.handlerPath.split("/").length
        ? a.handlerPath.endsWith("*")
          ? FRONT
          : SAME
        : SAME
    )
    .sort((a) => (a.isLayout ? BACK : SAME));
}

export async function getRoutes(dir: string, files: string[] = []) {
  const paths = await fs.promises.readdir(dir);
  const dirs: string[] = [];
  for (let i = 0, len = paths.length; i < len; i++) {
    const path = paths[i];
    const stats = fs.statSync(`${dir}/${path}`);
    if (stats.isDirectory()) {
      dirs.push(`${dir}/${path}`);
    } else {
      files.push(`${dir}/${path}`);
    }
  }
  for (let i = 0, len = dirs.length; i < len; i++) {
    const d = dirs[i];
    files = await getRoutes(d, files);
  }
  return files;
}

export interface Route {
  handlerPath: string;
  modulePath: string;
  isNotFound: boolean;
  isError: boolean;
  isLayout: boolean;
}
