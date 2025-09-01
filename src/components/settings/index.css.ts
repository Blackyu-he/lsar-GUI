import { style } from "@vanilla-extract/css";

export const buttons = style({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: "400px",
});
