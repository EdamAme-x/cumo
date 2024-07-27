import type { CumoContext, CumoResponse } from "../../../packages/runtime/mod";

export function POST(c: CumoContext): CumoResponse {
    return c.text("Hello, World! from sub.ts:POST");
}