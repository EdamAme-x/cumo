import type { CumoContext, CumoResponse } from "../../../packages/runtime/mod";

export default function Index(c: CumoContext): CumoResponse {
    return c.text("Hello, World! from index.ts");
}
