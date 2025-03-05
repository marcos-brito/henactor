<script lang="ts" generics="T">
    import type { FuseResult } from "fuse.js";

    let {
        result,
        key,
        getFn,
    }: {
        result: FuseResult<T>;
        key: string;
        getFn: (item: T) => string;
    } = $props();

    function shouldHighlight(idx: number, result: FuseResult<T>): boolean {
        if (!result.matches) return false;
        const matches = result.matches.find((m) => m.key == key);

        if (!matches) return false;
        return matches.indices.some((t) => {
            return idx >= t[0] && idx < t[1];
        });
    }
</script>

<div>
    {#each getFn(result.item) as c, i}
        {#if shouldHighlight(i, result)}
            <span class="text-info whitespace-nowrap">{c}</span>
        {:else}
            <span>{c}</span>
        {/if}
    {/each}
</div>
