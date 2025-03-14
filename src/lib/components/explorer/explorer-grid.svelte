<script lang="ts">
    import { type Entry } from "$lib/bindings";
    import { maxGridSize, minGridSize } from "$lib/utils";
    import { EntryGrid } from "../entry";
    import { GridNavigator } from "../navigator";
    import ExplorerBase from "./explorer-base.svelte";

    let {
        entries,
        path = $bindable(),
        selected = $bindable(),
        gridSize = $bindable(),
    }: {
        entries: Array<Entry>;
        path: string;
        selected: Array<string>;
        gridSize: number;
    } = $props();

    let navigator = $derived(new GridNavigator(entries.length, gridSize));
    let items = $state<Array<HTMLElement>>([]);
    let container = $state<HTMLElement>();

    $inspect(navigator.selected);

    $effect(() => {
        if (gridSize > maxGridSize) gridSize = maxGridSize;
        if (gridSize < minGridSize) gridSize = minGridSize;
    });
</script>

<ExplorerBase {items} {container} {navigator} {entries} bind:path bind:selected>
    <ul
        style:grid-template-columns={`repeat(${gridSize}, minmax(0, 1fr))`}
        bind:this={container}
        class="grid size-full auto-rows-min gap-4 overflow-y-scroll"
    >
        {#each entries as entry, i}
            <li bind:this={items[i]}>
                <button
                    class="btn btn-ghost size-full rounded-md"
                    class:bg-neutral={navigator.selected == i}
                    class:bg-base-300={selected.includes(entry.path)}
                >
                    <EntryGrid size={248 / gridSize} {entry} />
                </button>
            </li>
        {/each}
    </ul>
</ExplorerBase>
