<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        trigger,
        items,
    }: {
        trigger: Snippet<[typeof showMenu]>;
        items: Snippet;
    } = $props();

    let menu: HTMLElement;
    let x = $state(0);
    let y = $state(0);

    function showMenu(e: MouseEvent): void {
        x =
            e.clientX + menu.offsetWidth > window.innerWidth
                ? window.innerWidth - menu.offsetWidth - 30
                : e.clientX;
        y =
            e.clientY + menu.offsetHeight > window.innerHeight
                ? window.innerHeight - menu.offsetHeight - 30
                : e.clientY;

        e.stopPropagation();
        e.preventDefault();
        menu.showPopover();
    }
</script>

{@render trigger(showMenu)}
<ul
    popover="auto"
    bind:this={menu}
    class="rounded-box bg-base-200 w-48"
    style:top={`${y}px`}
    style:left={`${x}px`}
>
    {@render items()}
</ul>
