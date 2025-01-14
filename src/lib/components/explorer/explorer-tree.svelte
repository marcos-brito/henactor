<script lang="ts">
    import { type Entry } from "$lib/bindings";
    import { EntryTree } from "$lib/components/entry";
    import Navigation from "$lib/components/navigation/navigation.svelte";
    import ExplorerActions from "./explorer-actions.svelte";

    let {
        entries,
    }: {
        entries: Array<Entry>;
    } = $props();

    let ref = $state<HTMLElement>();
    let childsRef = $state<Array<HTMLElement>>([]);
</script>

{#if ref}
    <ExplorerActions trigger={ref} />
    <Navigation parent={ref} childrens={childsRef} orientation="Vertical" />
{/if}
<ul tabindex="-1" id="explorer" bind:this={ref} class="menu w-full">
    {#each entries as entry, i}
        <EntryTree bind:ref={childsRef[i]} {entry} />
    {/each}
</ul>
