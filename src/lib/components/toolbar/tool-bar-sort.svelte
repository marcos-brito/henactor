<script lang="ts">
    import { ArrowDownUpIcon } from "lucide-svelte";
    import IconWithFallback from "../icon/icon-with-fallback.svelte";
    import type { SortMethod } from "$lib/bindings";
    import { i18n } from "$lib";

    let { sortBy = $bindable() }: { sortBy: SortMethod } = $props();

    const aliases: Record<SortMethod, string> = {
        Name: i18n.t("toolBar.sort.methods.name", { ns: "ui" }),
        Size: i18n.t("toolBar.sort.methods.size", { ns: "ui" }),
        Kind: i18n.t("toolBar.sort.methods.kind", { ns: "ui" }),
        Natural: i18n.t("toolBar.sort.methods.natural", { ns: "ui" }),
        Accessed: i18n.t("toolBar.sort.methods.accessed", { ns: "ui" }),
        Modified: i18n.t("toolBar.sort.methods.modified", { ns: "ui" }),
        Created: i18n.t("toolBar.sort.methods.created", { ns: "ui" }),
    };
</script>

<article class="dropdown">
    <div tabindex="0" role="button" class="btn btn-ghost font-normal">
        <IconWithFallback size={20} iconName="sort">
            <ArrowDownUpIcon size="20" />
        </IconWithFallback>
        {i18n.t("toolBar.sort.title", { ns: "ui" })}
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
