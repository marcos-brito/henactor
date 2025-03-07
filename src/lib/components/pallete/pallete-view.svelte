<script lang="ts">
    import { i18n, tabsManager } from "$lib";
    import type { View } from "$lib/bindings";
    import PalleteBase from "./pallete-base.svelte";

    type Pair = {
        view: View;
        name: string;
    };

    let views: Array<Pair> = [
        {
            view: "Grid",
            name: i18n.t("toolBar.views.grid", { ns: "ui" }),
        },
        {
            view: "List",
            name: i18n.t("toolBar.views.list", { ns: "ui" }),
        },
        {
            view: "Tree",
            name: i18n.t("toolBar.views.tree", { ns: "ui" }),
        },
    ];
</script>

<PalleteBase
    name="pallete:views"
    items={views}
    getFn={(t) => t.name}
    executor={async (t) => {
        tabsManager.current.view = t.view;
    }}
>
    {#snippet children(pair)}
        {#if tabsManager.current.view == pair.view}
            <div class="badge badge-neutral">{i18n.t("pallete.active", { ns: "ui" })}</div>
        {/if}
    {/snippet}
</PalleteBase>
