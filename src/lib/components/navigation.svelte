<script lang="ts">
    import Keybinder from "$lib/components/keybinder.svelte";

    let {
        parent,
        childrens = $bindable(),
        orientation,
    }: {
        parent: HTMLElement;
        childrens: Array<HTMLElement>;
        orientation: "Vertical" | "Horizontal" | "Both";
    } = $props();

    let selected = $state(0);
    let selectedChild = $derived(childrens.at(selected));

    function selectPrevious(): void {
        if (selected == 0) return;
        selected--;
        selectedChild?.focus();
    }

    function selectNext(): void {
        if (selected == childrens.length - 1) return;
        selected++;
        selectedChild?.focus();
    }

    function handleFocus(): void {
        selected = 0;
        selectedChild?.focus();
    }

    parent.addEventListener("focus", handleFocus);
</script>

{#if orientation == "Vertical"}
    <Keybinder trigger={parent} actions={{ Down: selectNext, Up: selectPrevious }}></Keybinder>
{/if}
{#if orientation == "Horizontal"}
    <Keybinder trigger={parent} actions={{ Left: selectPrevious, Right: selectNext }}></Keybinder>
{/if}
