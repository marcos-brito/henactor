<script lang="ts">
    import { tabsManager } from "$lib";
    import { commands, type Entry } from "$lib/bindings";
    import { isDir } from "$lib/utils";
    import Base from ".";
    import { path as pathApi } from "@tauri-apps/api";

    let query = $state("");
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
        query = tabsManager.current.path;
    });

    $effect(() => {
        findSubDirs(query);
    });
</script>

<Base
    bind:query
    name="pallete:goto"
    items={entries}
    getFn={(entry) => entry.path}
    executor={async (entry) => {
        tabsManager.current.path = entry.path;
    }}
/>
