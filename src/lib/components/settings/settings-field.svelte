<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        name,
        desc,
        children,
    }: {
        children: Snippet;
        name: string;
        desc: string;
    } = $props();
</script>

<div class="flex items-center justify-between">
    <div class="flex flex-col items-start p-2">
        <h1 class="text-base">{name}</h1>
        <p class="opacity-70">{desc}</p>
    </div>
    {@render children()}
</div>
