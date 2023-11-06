import { invoke } from "@tauri-apps/api";
import { Pallete } from "./config/theme.ts";
import { Icons } from "./config/icons.ts";

export async function getConfigPath(): Promise<string> {
    const config_path: string = await invoke("get_config_path");

    return config_path;
}

export async function getThemeFile(): Promise<Pallete> {
    const pallete: Pallete = await invoke("get_theme_file", {
        theme: "default",
    });

    return pallete;
}

export async function getIconsFile(): Promise<Icons> {
    const icons: Icons = await invoke("get_icons_file", {
        theme: "default",
    });

    return icons;
}
