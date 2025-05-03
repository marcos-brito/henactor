<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        children,
        onclick,
        ...props
    }: {
        children: Snippet;
        onclick: (e: Event) => void;
        [key: string]: any;
    } = $props();
</script>

<button class="btn btn-ghost w-full justify-start" {onclick} {...props}>
    {#if children}
        {@render children()}
    {/if}
</button>
