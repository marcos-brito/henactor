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

<li>
    <button {onclick} {...props}>
        {#if children}
            {@render children()}
        {/if}
    </button>
</li>
