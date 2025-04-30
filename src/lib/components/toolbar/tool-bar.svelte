<script lang="ts">
    import type { View, SortMethod } from "$lib/bindings";
    import * as ToolBar from "./index";

    let {
        path = $bindable(),
        view = $bindable(),
        sortBy = $bindable(),
        gridSize = $bindable(),
    }: {
        path: string;
        view: View;
        sortBy: SortMethod;
        gridSize: number;
    } = $props();
</script>

<section class="flex items-center justify-between p-4">
    <ToolBar.BreadCrumb bind:path />
    <div class="flex items-center gap-2">
        <ToolBar.Sort bind:sortBy />
        <ToolBar.View bind:view />
        <ToolBar.Search />
        {#if view == "Grid"}
            <ToolBar.GridSize bind:gridSize />
        {/if}
    </div>
</section>
