import type { CumoContext, CumoResponse } from "../../../packages/runtime/mod";

export default function NotFound(c: CumoContext): CumoResponse {
    return c.text("Hello, World! from not-found.ts");
}