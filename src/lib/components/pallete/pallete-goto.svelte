<script lang="ts">
    import { tabsManager } from "$lib";
    import { commands, type Entry } from "$lib/bindings";
    import { isDir } from "$lib/utils";
    import PalleteBase from "./pallete-base.svelte";
    import { path as pathApi } from "@tauri-apps/api";

    let query = $state(tabsManager.current.path);
    let entries = $state<Array<Entry>>([]);

    async function findSubDirs(path: string): Promise<void> {
        const dirs = [];
        const parts = path.split(pathApi.sep());
        const found = await commands.list(parts.slice(0, -1).join(pathApi.sep()));

        for (const entry of found) {
            try {
                if (await isDir(entry)) dirs.push(entry);
            } catch {
                continue;
            }
        }

        entries = dirs;
    }

    $effect(() => {
        findSubDirs(query);
    });
</script>

<PalleteBase
    bind:query
    name="pallete:goto"
    items={entries}
    getFn={(entry) => entry.path}
    executor={async (entry) => {
        tabsManager.current.path = entry.path;
    }}
/>
