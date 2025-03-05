<script lang="ts">
    import { type Entry } from "$lib/bindings";
    import { EntryGrid } from "$lib/components/entry";
    import ExplorerActions from "./explorer-actions.svelte";

    let {
        entries,
        gridSize,
    }: {
        entries: Array<Entry>;
        gridSize: number;
    } = $props();

    let ref = $state<HTMLElement>();
</script>

{#if ref}
    <ExplorerActions trigger={ref} />
{/if}
<ul
    tabindex="-1"
    id="explorer"
    bind:this={ref}
    class="grid gap-4"
    style:grid-template-columns={`repeat(${gridSize}, minmax(0, 1fr))`}
>
    {#each entries as entry}
        <EntryGrid {entry} />
    {/each}
</ul>
