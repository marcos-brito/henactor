<script lang="ts">
    import { app } from "$lib/app.svelte";
    import { type Entry } from "$lib/bindings";
    import { Menu, Item, Sep } from "$lib/components/context-menu";
    import { _ } from "svelte-i18n";
    import { open } from "./entry";

    let { trigger, entry }: { trigger: HTMLElement; entry: Entry } = $props();
</script>

<Menu {trigger}>
    <Item onclick={async () => await open(entry)}>{$_("entry.open")}</Item>
    {#if entry.entry_type == "Directory"}
        <Item
            onclick={() => {
                app.tabs.add({ ...app.options.default_tab, path: entry.path });
            }}>{$_("entry.open_in_new_tab")}</Item
        >
    {/if}
    <Sep />
    <Item onclick={() => {}}>{$_("entry.copy")}</Item>
    <Item onclick={() => {}}>{$_("entry.copy_to")}</Item>
    <Item onclick={() => {}}>{$_("entry.move_to")}</Item>
    <Sep />
    <Item onclick={() => {}}>{$_("entry.rename")}</Item>
    <Item onclick={() => {}}>{$_("entry.compress")}</Item>
    <Sep />
    <Item onclick={() => {}}>{$_("entry.move_to_trash")}</Item>
    <Item onclick={() => {}}>{$_("entry.delete")}</Item>
</Menu>
