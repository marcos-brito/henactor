<script lang="ts">
    import { type Entry } from "$lib/bindings";
    import { EntryGrid } from "$lib/components/entry";
    import Navigation from "$lib/components/navigation/navigation.svelte";
    import ExplorerActions from "./explorer-actions.svelte";

    let {
        entries,
        gridSize,
    }: {
        entries: Array<Entry>;
        gridSize: number;
    } = $props();

    let ref = $state<HTMLElement>();
    let childsRef = $state<Array<HTMLElement>>([]);
</script>

{#if ref}
    <ExplorerActions trigger={ref} />
    <Navigation parent={ref} childrens={childsRef} orientation="Both" numberOfColumns={gridSize} />
{/if}
<ul
    tabindex="-1"
    id="explorer"
    bind:this={ref}
    class="grid gap-4"
    style:grid-template-columns={`repeat(${gridSize}, minmax(0, 1fr))`}
>
    {#each entries as entry, i}
        <EntryGrid bind:ref={childsRef[i]} {entry} />
    {/each}
</ul>
