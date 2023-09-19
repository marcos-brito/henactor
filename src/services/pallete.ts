import { invoke } from "@tauri-apps/api";

interface Colors {
  red: string;
  blue: string;
  green: string;
  yellow: string;
  purple: string;
}

export interface Pallete {
  background_dark: string;
  background_light: string;
  highlight: string;
  text_dark: string;
  text_light: string;
  accent: string;
  colors: Colors;
}

export async function get_pallete(): Promise<Pallete> {
  let theme: Pallete = await invoke("get_theme_file");
  return theme;
}
