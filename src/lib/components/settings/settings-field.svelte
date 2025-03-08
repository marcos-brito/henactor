<script lang="ts">
    import type { FuseResult } from "fuse.js";
    import type { Snippet } from "svelte";
    import SearchResult from "../search-result.svelte";

    let {
        name,
        desc,
        result,
        children,
    }: {
        children: Snippet;
        name: string;
        desc: string;
        result?: FuseResult<{ name: string; desc: string }>;
    } = $props();
</script>

<div class="flex items-center justify-between">
    <div class="flex flex-col items-start p-2">
        {#if result}
            <SearchResult {result} key="name" getFn={(i) => i.name} />
            <SearchResult {result} key="desc" getFn={(i) => i.desc} />
        {:else}
            <h1 class="text-base">{name}</h1>
            <p class="opacity-70">{desc}</p>
        {/if}
    </div>
    {@render children()}
</div>
