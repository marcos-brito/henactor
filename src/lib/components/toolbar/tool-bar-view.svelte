<script lang="ts">
    import type { View } from "$lib/bindings";
    import type { Snippet } from "svelte";
    import { FolderTreeIcon, LayoutGridIcon, LayoutListIcon } from "lucide-svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { i18n } from "$lib";

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
    {i18n.t("toolBar.views.tree", { ns: "ui" })}
{/snippet}

{#snippet list()}
    <IconWithFallback size={20} iconName="list_view">
        <LayoutListIcon size="20" />
    </IconWithFallback>
    {i18n.t("toolBar.views.list", { ns: "ui" })}
{/snippet}

{#snippet grid()}
    <IconWithFallback size={20} iconName="grid_view">
        <LayoutGridIcon size="20" />
    </IconWithFallback>
    {i18n.t("toolBar.views.grid", { ns: "ui" })}
{/snippet}

<article class="dropdown dropdown-end dropdown-bottom">
    <button class="btn btn-ghost font-normal">
        {@render buttons[view]()}
    </button>
    <ul class="menu dropdown-content z-50 w-52 rounded-box bg-base-200 p-2 shadow-sm">
        {#each Object.entries(buttons) as [name, viewButton]}
            <li>
                <button onclick={() => (view = name as View)}>
                    {@render viewButton()}
                </button>
            </li>
        {/each}
    </ul>
</article>
