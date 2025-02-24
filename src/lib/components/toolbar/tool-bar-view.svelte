<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { View } from "$lib/bindings";
    import type { Snippet } from "svelte";
    import { FolderTreeIcon, LayoutGridIcon, LayoutListIcon } from "lucide-svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";

    let { view = $bindable() }: { view: View } = $props();

    let buttons: Record<View, Snippet> = {
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

<article class="dropdown dropdown-end dropdown-bottom">
    <button class="btn btn-ghost font-normal">
        {@render buttons[view]()}
    </button>
    <ul class="menu dropdown-content z-50 w-52 rounded-box bg-base-200 p-2 shadow">
        {#each Object.entries(buttons) as [name, viewButton]}
            <li>
                <button onclick={() => (view = name as View)}>
                    {@render viewButton()}
                </button>
            </li>
        {/each}
    </ul>
</article>
