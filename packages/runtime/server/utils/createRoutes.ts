import { InternalServerConfig } from "../server-config";
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

const REGEXP_INDEX_ROUTE = new RegExp(`^index\.${EXTENSIONS.join("|")}$`);
const REGEXP_EXT_ROUTE = new RegExp(`\.(${EXTENSIONS.join("|")})$`);

function parseHandlerPath(parentPath: string, routeName: string): string {
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
    .replace(REGEXP_EXT_ROUTE, "");

  return [...parsedParentPath, parsedParentPath[parsedParentPath.length - 1] === "*" ? null : parsedRouteName].filter(Boolean).join("/");
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

  return formattedRoutes.map((route) => {
    return {
      handlerPath: parseHandlerPath(
        route.parentPath.replace(rotuesPath, ""),
        route.name
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
    };
  });
}

export async function getRoutes(dir, files: string[] = []) {
  const paths = await fs.promises.readdir(dir);
  const dirs: string[] = [];
  for (const path of paths) {
    const stats = fs.statSync(`${dir}/${path}`);
    if (stats.isDirectory()) {
      dirs.push(`${dir}/${path}`);
    } else {
      files.push(`${dir}/${path}`);
    }
  }
  for (const d of dirs) {
    files = await getRoutes(d, files);
  }
  return files;
}

interface Route {
  handlerPath: string;
  modulePath: string;
  isNotFound: boolean;
  isError: boolean;
}
