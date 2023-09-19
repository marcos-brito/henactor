import { invoke } from "@tauri-apps/api";

interface Font {
    font: string;
    small_text: number;
    regular_text: number;
    big_text: number;
    regular_title: number;
    big_title: number;
}

export async function get_fonts(): Promise<Font> {
    let fonts: Font = await invoke("get_fonts_file");
    return fonts;
}
