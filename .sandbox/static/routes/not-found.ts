import type { CumoContext, CumoResponse } from "../../../packages/runtime/mod";

export default function NotFound(c: CumoContext): CumoResponse {
  return c.text("Not Found! from not-found.ts");
}
