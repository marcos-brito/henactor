import { i18n } from "$lib";
import { commands, type Entry, type SortMethod } from "$lib/bindings";
import { path as pathApi } from "@tauri-apps/api";

export const maxGridSize = 8;
export const minGridSize = 2;

const keyAliases: Record<string, string> = {
    Control: "Ctrl",
    " ": "Space",
    ArrowUp: "▲",
    ArrowDown: "▼",
    ArrowLeft: "◀︎",
    ArrowRight: "▶︎",
};

export function findKeyAlias(key: string): string {
    return keyAliases[key] || key;
}

export function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: Event) => {
        const target = event.target as HTMLElement;
        if (node && !node.contains(target) && !event.defaultPrevented) {
            callback();
        }
    };
    document.addEventListener("click", handleClick, true);
    document.addEventListener("contextmenu", handleClick, true);

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true);
        },
    };
}

export async function linkIsBroken(entry: Entry): Promise<boolean> {
    try {
        await commands.findLinkTarget(entry.path);
        return false;
    } catch {
        return true;
    }
}

export async function isDir(entry: Entry): Promise<boolean> {
    if (entry.entry_type == "Directory") return true;
    if (entry.entry_type == "File") return false;

    return await commands
        .findLinkTarget(entry.path)
        .then((entry) => entry.entry_type == "Directory");
}

export function parent(path: string): string {
    return path.split(pathApi.sep()).slice(0, -1).join(pathApi.sep());
}

export function fileName(path: string): string {
    const parts = path.split(pathApi.sep());
    return parts[parts.length - 1];
}

export function trucate(text: string, maxChars: number): string {
    if (text.length < maxChars) return text;
    const head = text.substring(0, maxChars / 2);
    const tail = text.substring(text.length - maxChars / 2);
    return `${head}…${tail}`;
}
