<script lang="ts">
    import { type Entry, type ListColumn } from "$lib/bindings";
    import { EllipsisVerticalIcon } from "lucide-svelte";
    import { EntryList } from "$lib/components/entry";
    import Modal from "$lib/components/modal.svelte";
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
</script>

{#if ref}
    <ExplorerActions trigger={ref} />
{/if}
<table tabindex="-1" id="explorer" bind:this={ref} class="table-pin-rows table">
    <thead>
        <tr class="border-none">
            <th>
                <h1>columns goes here</h1>
            </th>
            <th>Name</th>
            {#each columns as column}
                <th>{column}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each entries as entry}
            <EntryList {columns} {entry} />
        {/each}
    </tbody>
</table>
