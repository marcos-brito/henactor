<script lang="ts">
    import { commands, events, type Entry } from "$lib/bindings";
    import type { UnlistenFn } from "@tauri-apps/api/event";
    import EntryActions, { findRealEntryType } from "./entry-actions.svelte";
    import EntryIcon from "./entry-icon.svelte";
    import EntryTree from "./entry-tree.svelte";
    import IconWithFallback from "../icon/icon-with-fallback.svelte";
    import { BirdIcon } from "lucide-svelte";
    import { i18n } from "$lib";

    let { entry, ref = $bindable() }: { entry: Entry; ref: HTMLElement } = $props();
    let isOpen = $state(false);
    let entries = $state<Array<Entry>>([]);
    let childsRef = $state<Array<HTMLElement>>([]);
    let watcher: number;
    let unlisten: UnlistenFn;

    async function toogle() {
        if (!isOpen) {
            isOpen = true;
            entries = await commands.list(entry.path);
            watcher = await commands.watch(entry.path, false);
            unlisten = await events.watchEvent.listen(async (event) => {
                if (event.payload.includes(watcher.toString())) {
                    entries = await commands.list(entry.path);
                }
            });
            return;
        }

        isOpen = false;
        unlisten();
    }
</script>

{#if ref}
    <EntryActions trigger={ref} {entry} />
{/if}
<li class="entry rounded-sm text-base">
    {#await findRealEntryType(entry) then kind}
        {#if kind == "File"}
            <button bind:this={ref} class="outline-2 outline-current focus:outline!">
                <EntryIcon {entry} />
                <p>{entry.name}</p>
            </button>
        {/if}
        {#if kind == "Directory"}
            <details open={isOpen}>
                <summary bind:this={ref} onclick={async () => await toogle()}>
                    <EntryIcon {entry} />
                    <p>{entry.name}</p>
                </summary>
                <ul>
                    {#if entries.length == 0}
                        <div class="flex items-center gap-4">
                            <IconWithFallback iconName="empty_dir">
                                <BirdIcon />
                            </IconWithFallback>
                            <p class="text-sm">{i18n.t("emptyDir", { ns: "ui" })}</p>
                        </div>
                    {:else}
                        {#each entries as entry, i}
                            <EntryTree bind:ref={childsRef[i]} {entry} />
                        {/each}
                    {/if}
                </ul>
            </details>
        {/if}
    {/await}
</li>
