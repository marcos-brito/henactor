<script lang="ts">
    import type { Snippet } from "svelte";
    import { findKeyAlias } from "$lib/utils";

    let { keybind, children }: { keybind: string; children?: Snippet } = $props();
</script>

<div class="bg-base-200 flex items-center gap-1 rounded-sm px-2 py-[2px]">
    <div class="flex gap-1 text-sm">
        {#each keybind.split("+") as key, i}
            <p class="capitalize">{findKeyAlias(key)}</p>
            {#if i != keybind.split("+").length - 1}
                <p>+</p>
            {/if}
        {/each}
    </div>
    {#if children}
        {@render children()}
    {/if}
</div>
