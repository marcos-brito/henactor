<script lang="ts">
    import { type Entry, type ListColumn } from "$lib/bindings";
    import { EntryList } from "$lib/components/entry";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import Navigation from "$lib/components/navigation/navigation.svelte";
    import ExplorerActions from "./explorer-actions.svelte";

    let {
        columns = $bindable(),
        entries,
    }: {
        entries: Array<Entry>;
        columns: Array<ListColumn>;
    } = $props();

    let ref = $state<HTMLElement>();
    let childsRef = $state<Array<HTMLElement>>([]);
</script>

{#if ref}
    <ExplorerActions trigger={ref} />
    <Navigation parent={ref} childrens={childsRef} orientation="Vertical" />
{/if}
<table tabindex="-1" id="explorer" bind:this={ref} class="table table-pin-rows">
    <thead>
        <tr class="border-none">
            <th>Name</th>
            {#each columns as column}
                <th>{column}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each entries as entry, i}
            <EntryList bind:ref={childsRef[i]} {columns} {entry} />
        {/each}
    </tbody>
</table>
