<script lang="ts">
    import { type Entry } from "$lib/bindings";
    import { EntryTree } from "$lib/components/entry";
    import ExplorerActions from "./explorer-actions.svelte";

    let {
        entries,
    }: {
        entries: Array<Entry>;
    } = $props();

    let ref = $state<HTMLElement>();
</script>

{#if ref}
    <ExplorerActions trigger={ref} />
{/if}
<ul tabindex="-1" id="explorer" bind:this={ref} class="menu w-full">
    {#each entries as entry}
        <EntryTree {entry} />
    {/each}
</ul>
