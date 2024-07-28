import type {
  CumoContext,
  CumoResponse,
} from "../../../../packages/runtime/mod";

export default function (c: CumoContext): CumoResponse {
  return c.redirect("https://github.com/EdamAme-x/cumo", 302);
}
