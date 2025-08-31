import { style } from "@vanilla-extract/css";
import { vars } from "fluent-solid/lib/themes";

export const history = style({
  height: "600px",
  flex: 1.2,
  overflowY: "auto",
  boxSizing: "border-box",
  paddingTop: vars.spacingVerticalS,
  paddingBottom: vars.spacingVerticalS,
});
