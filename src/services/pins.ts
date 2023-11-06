import { invoke } from "@tauri-apps/api";

interface PinnedItem {
    name: string;
    path: string;
    icon: string;
}

export async function getPinnedItems(): Promise<Array<PinnedItem>> {
    const pins: Array<PinnedItem> = await invoke("get_pinned_items");

    return pins;
}
