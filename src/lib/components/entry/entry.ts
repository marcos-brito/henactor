import { app } from "$lib/app.svelte";
import { commands, type Entry, type EntryType } from "$lib/bindings"
import { path as pathApi } from "@tauri-apps/api";

export function gotoParent(entry: Entry): void {
    const parts = entry.path.split(pathApi.sep()).slice(1);
    if (parts.length < 2) return
    const parent = `${pathApi.sep()}${parts.slice(0, parts.length - 2).join(pathApi.sep())}`
    app.tabs.setCurrentPath(parent);
}

export async function open(entry: Entry): Promise<void> {
    const realType = await findRealEntryType(entry);
    if (realType == "Directory") app.tabs.setCurrentPath(entry.path);
}

export async function findRealEntryType(entry: Entry): Promise<EntryType> {
    if (entry.entry_type != "Symlink") return entry.entry_type
    const target = await commands.findLinkTarget(entry.path)
    return target.entry_type
}
