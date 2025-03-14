<script lang="ts">
    import type { View, SortMethod } from "$lib/bindings";
    import ToolBarSort from "./tool-bar-sort.svelte";
    import ToolBarView from "./tool-bar-view.svelte";
    import ToolBarFilter from "./tool-bar-filter.svelte";
    import ToolBarBreadcrumb from "./tool-bar-breadcrumb.svelte";
    import ToolBarGridSize from "./tool-bar-grid-size.svelte";

    let {
        path = $bindable(),
        view = $bindable(),
        sortBy = $bindable(),
        filter = $bindable(),
        gridSize = $bindable(),
    }: {
        path: string;
        view: View;
        sortBy: SortMethod;
        filter: string;
        gridSize: number;
    } = $props();
</script>

<section class="flex items-center justify-between p-4">
    <ToolBarBreadcrumb bind:path />
    <div class="flex items-center gap-2">
        <ToolBarFilter bind:filter />
        <ToolBarSort bind:sortBy />
        <ToolBarView bind:view />
        {#if view == "Grid"}
            <ToolBarGridSize bind:gridSize />
        {/if}
    </div>
</section>
