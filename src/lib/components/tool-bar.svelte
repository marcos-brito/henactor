<script lang="ts">
    import { _ } from "svelte-i18n";
    import Breadcrumb from "./breadcrumb.svelte";
    import type { View } from "$lib/bindings";
    import type { Snippet } from "svelte";
    import {
        FilterIcon,
        ArrowDownUpIcon,
        FolderTreeIcon,
        LayoutGridIcon,
        LayoutListIcon,
    } from "lucide-svelte";
    import IconWithFallback from "./icon/icon-with-fallback.svelte";

    let { path = $bindable(), view = $bindable() }: { path: string; view: View } = $props();
    let viewButtons: Record<View, Snippet> = {
        Grid: grid,
        List: list,
        Tree: tree,
    };
</script>

{#snippet tree()}
    <IconWithFallback size={20} iconName="tree_view">
        <FolderTreeIcon size="20" />
    </IconWithFallback>
    {$_("view.tree")}
{/snippet}

{#snippet list()}
    <IconWithFallback size={20} iconName="list_view">
        <LayoutListIcon size="20" />
    </IconWithFallback>
    {$_("view.list")}
{/snippet}

{#snippet grid()}
    <IconWithFallback size={20} iconName="grid_view">
        <LayoutGridIcon size="20" />
    </IconWithFallback>
    {$_("view.grid")}
{/snippet}

<section class="flex items-center justify-between p-4">
    <Breadcrumb bind:path />
    <div>
        <button class="btn btn-ghost font-normal">
            <IconWithFallback size={20} iconName="filter">
                <FilterIcon size="20" />
            </IconWithFallback>
            {$_("filter")}
        </button>
        <button class="btn btn-ghost font-normal">
            <IconWithFallback size={20} iconName="sort">
                <ArrowDownUpIcon size="20" />
            </IconWithFallback>
            {$_("sort")}
        </button>
        <div class="dropdown dropdown-end dropdown-bottom">
            <button class="btn btn-ghost font-normal">
                {@render viewButtons[view]()}
            </button>
            <ul class="menu dropdown-content z-50 w-52 rounded-box bg-base-200 p-2 shadow">
                {#each Object.entries(viewButtons) as [name, viewButton]}
                    <li>
                        <button onclick={() => (view = name as View)}>
                            {@render viewButton()}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</section>
