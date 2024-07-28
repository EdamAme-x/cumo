import { css, cx } from "@hono/hono/css";

export const ContainerCSS = css`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export const BorderCSS = css`
  border: 1px solid #ffffff32;
`;

export const BoxCSS = cx(
  BorderCSS,
  css`
    padding: 4px 12px;
    border-radius: 6px;
  `
);

export const LabelCSS = cx(
  BoxCSS,
  css`
    font-size: 1rem;
    padding: 1px 4px;
    border-radius: 4px;
  `
);

export const HeaddingCSS = css`
  font-size: 2rem;
  font-weight: bolder;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const ReadDocsCSS = css`
  font-size: 0.75rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  color: #ffffff;
`;

export const TextGradientCSS = css`
  background: linear-gradient(0deg, #fafafa 0%, #a3a3a3 100%);
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
