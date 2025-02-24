<script lang="ts">
    import { ArrowDownUpIcon } from "lucide-svelte";
    import IconWithFallback from "../icon/icon-with-fallback.svelte";
    import { _ } from "svelte-i18n";
    import type { SortMethod } from "$lib/bindings";

    let { sortBy = $bindable() }: { sortBy: SortMethod } = $props();

    const aliases: Record<SortMethod, string> = {
        Name: "A-Z",
        Size: "Size",
        Kind: "Kind",
        Natural: "First found",
        Accessed: "Last accessed",
        Modified: "Last modified",
        Created: "Most recent",
    };
</script>

<article class="dropdown">
    <div tabindex="0" role="button" class="btn btn-ghost font-normal">
        <IconWithFallback size={20} iconName="sort">
            <ArrowDownUpIcon size="20" />
        </IconWithFallback>
        {$_("sort")}
    </div>
    <ul tabindex="0" class="menu dropdown-content z-50 w-52 rounded-box bg-base-200 p-2 shadow">
        {#each Object.entries(aliases) as [method, alias]}
            <li class="w-full">
                <label class="label flex justify-normal gap-3">
                    <input
                        bind:group={sortBy}
                        value={method}
                        type="radio"
                        name="radio-10"
                        class="radio radio-xs"
                        checked={method === sortBy}
                    />
                    <span class="label-text">{alias}</span>
                </label>
            </li>
        {/each}
    </ul>
</article>
