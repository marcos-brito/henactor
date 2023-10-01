import { invoke } from "@tauri-apps/api";

export interface Icons {
    directory: string;
    file: string;
    settings: string;
    view: string;
    sort: string;
    filter: string;
    search: string;
    close: string;
    add: string;
}

export async function get_icons(): Promise<Icons> {
    let icons: Icons = await invoke("get_icons_file");
    return icons;
}
