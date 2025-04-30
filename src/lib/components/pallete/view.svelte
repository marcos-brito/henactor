<script lang="ts">
    import { i18n, tabsManager } from "$lib";
    import type { View } from "$lib/bindings";
    import Base from ".";

    const views: Array<View> = ["Grid", "List", "Tree"];

    const items = views.map((view) => {
        return {
            view,
            name: i18n.t(`ui:toolBar.views.${view.toLowerCase()}`),
        };
    });
</script>

<Base
    name="pallete:views"
    {items}
    getFn={(pair) => pair.name}
    executor={async (pair) => {
        tabsManager.current.view = pair.view;
    }}
>
    {#snippet children(pair)}
        {#if tabsManager.current.view == pair.view}
            <div class="badge badge-neutral">{i18n.t("pallete.active", { ns: "ui" })}</div>
        {/if}
    {/snippet}
</Base>
