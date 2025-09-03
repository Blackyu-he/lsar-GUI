import { invoke } from "@tauri-apps/api/core";

type ColorMode = "LIGHT" | "DARK";

export const setTitlebarColorMode = (colorMode: ColorMode): Promise<void> => {
  if (import.meta.env.TAURI_ENV_PLATFORM !== "windows") {
    return Promise.resolve(void 0);
  }
  return invoke<void>("set_titlebar_color_mode", { colorMode });
};
