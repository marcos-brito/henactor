<script lang="ts">
    import { clickOutside } from "$lib/utils";
    import type { Snippet } from "svelte";
    import Keybinder from "../keybinder.svelte";

    let {
        children,
        trigger,
    }: {
        children: Snippet;
        trigger: HTMLElement;
    } = $props();

    let isActive = $state(false);
    let menu = $state<HTMLElement>();
    let x = $state(0);
    let y = $state(0);

    $effect(() => {
        if (menu && isActive) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            if (x + menu.offsetWidth > windowWidth) x = windowWidth - menu.offsetWidth - 30;
            if (y + menu.offsetHeight > windowHeight) y = windowHeight - menu.offsetHeight - 30;
            menu.focus();
        }
    });

    function openAt($x: number, $y: number) {
        x = $x;
        y = $y;
        isActive = true;
    }

    function handleClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        openAt(e.clientX, e.clientY);
    }

    function handleOpenKeyPressed(): void {
        openAt(trigger.getBoundingClientRect().left, trigger.getBoundingClientRect().top);
    }

    trigger.addEventListener("contextmenu", handleClick);
</script>

<Keybinder element={trigger} actions={{ OpenDetails: handleOpenKeyPressed }} />

{#if isActive}
    <ul
        tabindex="-1"
        bind:this={menu}
        use:clickOutside={() => (isActive = false)}
        onclick={() => (isActive = false)}
        class="menu absolute z-10 w-48 rounded-box bg-base-200"
        style:top={`${y}px`}
        style:left={`${x}px`}
    >
        {@render children()}
    </ul>
{/if}
