<script module lang="ts">
    import { tabsManager } from "$lib";
    import { commands, type Entry, type EntryType, type Command } from "$lib/bindings";

    export function gotoParent(entry: Entry): void {
        tabsManager.setCurrentPath(parent(entry.path));
    }

    export async function open(entry: Entry): Promise<void> {
        const realType = await findRealEntryType(entry);
        if (realType == "Directory") tabsManager.setCurrentPath(entry.path);
    }

    export async function findRealEntryType(entry: Entry): Promise<EntryType> {
        if (entry.entry_type != "Symlink") return entry.entry_type;
        const target = await commands.findLinkTarget(entry.path);
        return target.entry_type;
    }
</script>

<script lang="ts">
    import { Menu, Item, Sep } from "$lib/components/context-menu";
    import { _ } from "svelte-i18n";
    import Keybinder from "$lib/components/keybinder.svelte";
    import { parent } from "$lib/utils";
    let {
        trigger,
        entry,
        actions,
    }: { trigger: HTMLElement; entry: Entry; actions?: Partial<Record<Command, () => void>> } =
        $props();
</script>

<Keybinder
    {trigger}
    actions={{
        Open: () => {
            open(entry);
        },
        GotoParent: () => {
            gotoParent(entry);
        },
        ...actions,
    }}
/>
<Menu {trigger}>
    <Item onclick={async () => await open(entry)}>{$_("entry.open")}</Item>
    {#if entry.entry_type == "Directory"}
        <Item
            onclick={() => {
                tabsManager.add({ ...tabsManager.defaultTab, path: entry.path });
            }}>{$_("entry.open_in_new_tab")}</Item
        >
    {/if}
