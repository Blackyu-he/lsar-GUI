import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
});

export const notMacos = style({
  flex: 1,
});

export const rightContainer = style({
  flex: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

export const settingsButton = style({
  position: "fixed",
  right: 20,
  top: 30,
});
