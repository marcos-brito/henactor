<script lang="ts">
    import Explorer from "$lib/components/explorer.svelte";
    import Toolbar from "$lib/components/tool-bar.svelte";
    import { tabsManager } from "$lib";
    import { _ } from "svelte-i18n";
</script>

<Toolbar bind:view={tabsManager.current.view} bind:path={tabsManager.current.path} />
<div class="h-[70vh] overflow-auto p-4">
    <Explorer
        path={tabsManager.current.path}
        bind:gridSize={tabsManager.current.grid_size}
        bind:view={tabsManager.current.view}
        bind:query={tabsManager.current.query}
    />
</div>
