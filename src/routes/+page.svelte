<script lang="ts">
    import Toolbar from "$lib/components/toolbar/tool-bar.svelte";
    import { tabsManager } from "$lib";
    import { commands, events, type Entry } from "$lib/bindings";
    import type { UnlistenFn } from "@tauri-apps/api/event";
    import {
        ExplorerGrid,
        ExplorerList,
        ExplorerTree,
        ExplorerEmpty,
    } from "$lib/components/explorer";
    import StatusBar from "$lib/components/status-bar.svelte";

    let unlisten: UnlistenFn;
    let rawEntries = $state<Array<Entry>>([]);
    let entries = $state<Array<Entry>>([]);

    async function findEntries(): Promise<void> {
        if (unlisten) unlisten();
        const path = tabsManager.current.path;
        await commands.watch(path, false);

        rawEntries = await commands.list(path);
        unlisten = await events.watchEvent.listen(async (event) => {
            if (event.payload.includes(path)) rawEntries = await commands.list(path);
        });
    }

    $effect(() => {
        if (tabsManager.current.path) {
            findEntries();
        }
    });
</script>

<Toolbar
    bind:path={tabsManager.current.path}
    bind:sortBy={tabsManager.current.sort_by}
    bind:view={tabsManager.current.view}
    bind:gridSize={tabsManager.current.grid_size}
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
    <StatusBar providers={statusRegistry.find(...configManager.config.status)} />
</div>
