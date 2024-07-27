import type { CumoResponse } from "../../../packages/runtime/mod";

export default function Index(): CumoResponse {
    return <>
        <h1>Hello, World! from index.ts</h1>
        {(<p>a</p>).toString()}
    </>;
}
