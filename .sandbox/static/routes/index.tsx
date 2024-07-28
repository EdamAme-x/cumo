import type { CumoResponse } from "../../../packages/runtime/mod";
import {
  ContainerCSS,
  HeaddingCSS,
  LabelCSS,
  ReadDocsCSS,
  TextGradientCSS,
} from "../styles/topPage";
import { BoxCSS } from "./../styles/topPage";

export default function Index(): CumoResponse {
  return (
    <div class={ContainerCSS}>
      <h1 class={HeaddingCSS}>
        <span class={TextGradientCSS}>Cumo.js</span>{" "}
        <div class={LabelCSS}>Beta</div>
      </h1>
      <div class={BoxCSS}>
        <a href="/docs" class={ReadDocsCSS}>
          Read Docs
        </a>
      </div>
    </div>
  );
}
