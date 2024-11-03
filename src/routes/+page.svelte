<script lang="ts">
    import { app } from "$lib/app.svelte";
    import Explorer from "$lib/components/explorer.svelte";
    import Toolbar from "$lib/components/tool-bar.svelte";
    import { _ } from "svelte-i18n";
</script>

<Toolbar bind:view={app.tabs.current.view} bind:path={app.tabs.current.path} />
<div class="h-[70vh] overflow-auto p-4">
    <Explorer
        path={app.tabs.current.path}
        bind:gridSize={app.tabs.current.grid_size}
        bind:view={app.tabs.current.view}
        bind:query={app.tabs.current.query}
        bind:columns={app.tabs.current.list_columns}
    />
</div>
