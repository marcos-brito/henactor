<script lang="ts">
    import Toolbar from "$lib/components/toolbar/tool-bar.svelte";
    import { tabsManager } from "$lib";
    import { _ } from "svelte-i18n";
    import { commands, events, type Entry } from "$lib/bindings";
    import type { UnlistenFn } from "@tauri-apps/api/event";
    import {
        ExplorerGrid,
        ExplorerList,
        ExplorerTree,
        ExplorerEmpty,
    } from "$lib/components/explorer";

    let watcher: number;
    let unlisten: UnlistenFn;
    let rawEntries = $state<Array<Entry>>([]);
    let entries = $state<Array<Entry>>([]);

    async function findEntries(): Promise<void> {
        const path = tabsManager.current.path;

        rawEntries = await commands.list(path);
        watcher = await commands.watch(path, false);
        unlisten = await events.watchEvent.listen(async (event) => {
            if (event.payload.includes(watcher.toString())) {
                rawEntries = await commands.list(path);
            }
        });
    }

    $effect(() => {
        if (tabsManager.current.path) {
            findEntries();
        }

        return () => {
            if (watcher && unlisten) {
                unlisten();
                commands.unwatch(watcher);
            }
        };
    });
</script>

<Toolbar
    bind:path={tabsManager.current.path}
    bind:filter={tabsManager.current.filter}
    bind:sortBy={tabsManager.current.sort_by}
    bind:view={tabsManager.current.view}
/>
<div class="h-[70vh] overflow-auto p-4">
    {#if rawEntries.length == 0}
        <ExplorerEmpty />
    {:else}
        {#if tabsManager.current.view === "Grid"}
            <ExplorerGrid gridSize={tabsManager.current.grid_size} {entries} />
        {/if}
        {#if tabsManager.current.view === "List"}
            <ExplorerList bind:columns={tabsManager.current.list_columns} {entries} />
        {/if}
        {#if tabsManager.current.view === "Tree"}
            <ExplorerTree {entries} />
        {/if}
    {/if}
</div>
