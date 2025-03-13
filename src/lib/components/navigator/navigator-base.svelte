<script lang="ts">
    import type { Snippet } from "svelte";
    import { type Navigator } from "./navigator.svelte";

    let {
        children,
        container,
        items,
        navigator = $bindable(),
    }: {
        children: Snippet;
        container: HTMLElement | undefined;
        items: Array<HTMLElement>;
        navigator: Navigator;
    } = $props();

    $effect(() => {
        if (!container || !items.at(navigator.selected)) return;

        const containerRect = container.getBoundingClientRect();
        const itemRect = items[navigator.selected].getBoundingClientRect();

        if (itemRect.top < containerRect.top)
            container.scrollBy({ top: itemRect.top - containerRect.top, behavior: "smooth" });

        if (itemRect.bottom > containerRect.bottom)
            container.scrollBy({
                top: itemRect.bottom - containerRect.bottom,
                behavior: "smooth",
            });

        if (itemRect.left < containerRect.left)
            container.scrollBy({
                left: itemRect.left - containerRect.left,
                behavior: "smooth",
            });

        if (itemRect.right > containerRect.right)
            container.scrollBy({
                left: itemRect.right - containerRect.right,
                behavior: "smooth",
            });
    });
</script>

{@render children()}
