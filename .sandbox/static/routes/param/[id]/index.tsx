import type {
  CumoContext,
  CumoResponse,
} from "../../../../packages/runtime/mod";

export function GET(c: CumoContext): CumoResponse {
  return c.html(
    <>
      <h1>Hello, World! from [id]/index.ts</h1>
      <p>params | id: {c.req.param("id")}</p>
    </>
  );
}
