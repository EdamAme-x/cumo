import { InternalServerConfig, ServerConfig } from "../server-config";
import type { Dirent } from "node:fs";
import { join } from "node:path";
import * as fs from "node:fs";


const EXTENSIONS = ["ts", "tsx", "js", "jsx"];

function filterRoutes(routes: Dirent[]): Dirent[] {
    return routes.filter((route) => {
        return EXTENSIONS.some((ext) => route.name.endsWith("." + ext)) && !route.isDirectory();
    });
}

function normlizePath(path: string): string {
    return "./" + path.replace(/\\/g, "/");
}

const REGEXP_NO_ROUTE = /^\([a-zA-Z0-9-_]+\)$/;
const REGEXP_PARAM_ROUTE = /^\[[a-zA-Z0-9-_]+\]$/;
const REGEXP_ALL_ROUTE = /^\[\.\.\.[a-zA-Z0-9-_]+\]$/;

function parseHandlerPath(parentPath: string, routeName: string): string {
    const parsedParentPath = parentPath.split("/").map((dirName) => {
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
    }).filter((dirName) => dirName !== null);

    const parsedRouteName = routeName.replace(/^index\.$/, "");

    return [...parsedParentPath, parsedRouteName].join("/");
}

export function createRoutes<B extends string>(routes: Dirent[], config: InternalServerConfig<any, B>): Route[] {
    const filteredRoutes = filterRoutes(routes);

    return filteredRoutes
        .map((route) => {
            const parentPath = normlizePath(route.parentPath);

            return {
                parentPath,
                handlerPath: parseHandlerPath(parentPath, route.name),
                modulePath:  normlizePath(join(parentPath, route.name)),
                isNotFound: new RegExp(`${config.notFoundPattern}\.(${EXTENSIONS.join("|")})$`).test(route.name),
                isError: new RegExp(`${config.serverErrorPattern}\.(${EXTENSIONS.join("|")})$`).test(route.name),
            }
        })
} 

export async function getRoutes(rotuesPath: string): Promise<Dirent[]> {
    return await fs.promises.readdir(rotuesPath, {
        withFileTypes: true,
        recursive: true
    })
}

interface Route {
    parentPath: string;
    handlerPath: string;
    modulePath: string;
    isNotFound: boolean;
    isError: boolean;
}
