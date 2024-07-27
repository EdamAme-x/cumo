import type { CumoContext, CumoResponse } from "../../../../../packages/runtime/mod";

export function GET(c: CumoContext): CumoResponse {
    return c.text("Hello, World! from all/[...all]/index.ts");
}
