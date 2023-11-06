import { invoke } from "@tauri-apps/api";
import { FileSystemEntry } from "@/type";

export async function getDirEntries(
    path: string,
): Promise<Array<FileSystemEntry>> {
    const content: Array<FileSystemEntry> = await invoke("get_dir_entries", {
        path: path,
    });

    return content;
}
