<script lang="ts">
    import { i18n, tabsManager } from "$lib";
    import type { SortMethod } from "$lib/bindings";
    import Base from ".";

    const aliases: Record<SortMethod, string> = {
        Name: i18n.t("toolBar.sort.methods.name", { ns: "ui" }),
        Size: i18n.t("toolBar.sort.methods.size", { ns: "ui" }),
        Kind: i18n.t("toolBar.sort.methods.kind", { ns: "ui" }),
        DetailedKind: i18n.t("toolBar.sort.methods.detailedKind", { ns: "ui" }),
        Natural: i18n.t("toolBar.sort.methods.natural", { ns: "ui" }),
        Accessed: i18n.t("toolBar.sort.methods.accessed", { ns: "ui" }),
        Modified: i18n.t("toolBar.sort.methods.modified", { ns: "ui" }),
        Created: i18n.t("toolBar.sort.methods.created", { ns: "ui" }),
    };

    const items = Object.entries(aliases).map(([method, alias]) => {
        return { method: method as SortMethod, alias };
    });
</script>

<Base
    name="pallete:sort"
    {items}
    getFn={(pair) => pair.alias}
    executor={async (pair) => {
        tabsManager.current.sort_by = pair.method;
    }}
>
    {#snippet children(pair)}
        {#if tabsManager.current.sort_by == pair.method}
            <div class="badge badge-neutral">{i18n.t("pallete.active", { ns: "ui" })}</div>
        {/if}
    {/snippet}
</Base>
