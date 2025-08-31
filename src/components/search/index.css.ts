import { style } from "@vanilla-extract/css";
import { vars } from "fluent-solid/lib/themes";

export const badges = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacingHorizontalM,
  marginBottom: vars.spacingVerticalM,
});
