<script lang="ts">
    import Keybinder from "$lib/components/keybinder.svelte";
    import {
        gridNavigator,
        regularNavigation,
        type RegularNavigator,
        type GridNavigator,
    } from "./navigators.svelte";

    let props: {
        parent: HTMLElement;
        childrens: Array<HTMLElement>;
    } & (
        | { orientation: "Both"; numberOfColumns: number }
        | { orientation: "Vertical" | "Horizontal" }
    ) = $props();

    let navigator =
        props.orientation == "Both"
            ? gridNavigator(props.childrens, props.numberOfColumns)
            : regularNavigation(props.childrens);

    let selectedChild = $derived(props.childrens.at(navigator.selected));

    $effect(() => {
        selectedChild?.focus();
    });
</script>

{#snippet vertical(navigator: RegularNavigator)}
    <Keybinder trigger={props.parent} actions={{ Down: navigator.next, Up: navigator.previous }}
    ></Keybinder>
{/snippet}

{#snippet horizontal(navigator: RegularNavigator)}
    <Keybinder
        trigger={props.parent}
        actions={{
            Right: navigator.next,
            Left: navigator.previous,
        }}
    ></Keybinder>
{/snippet}

{#snippet both(navigator: GridNavigator)}
    <Keybinder
        trigger={props.parent}
        actions={{
            Right: navigator.right,
            Left: navigator.left,
            Up: navigator.up,
            Down: navigator.down,
        }}
    ></Keybinder>
{/snippet}

{#if props.orientation == "Both"}
    {@render both(navigator as GridNavigator)}
{/if}

{#if props.orientation == "Vertical"}
    {@render vertical(navigator as RegularNavigator)}
{/if}

{#if props.orientation == "Horizontal"}
    {@render horizontal(navigator as RegularNavigator)}
{/if}
