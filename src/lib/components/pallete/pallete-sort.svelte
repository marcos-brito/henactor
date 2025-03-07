<script lang="ts">
    import { i18n, tabsManager } from "$lib";
    import type { SortMethod } from "$lib/bindings";
    import PalleteBase from "./pallete-base.svelte";

    const methods: Array<SortMethod> = [
        "Name",
        "Size",
        "Kind",
        "Natural",
        "Accessed",
        "Modified",
        "Created",
    ];

    const items = methods.map((method) => {
        return {
            method,
            name: i18n.t(`ui:toolBar.sort.methods.${method.toLowerCase()}`),
        };
    });
</script>

<PalleteBase
    name="pallete:sort"
    {items}
    getFn={(pair) => pair.name}
    executor={async (pair) => {
        tabsManager.current.sort_by = pair.method;
    }}
>
    {#snippet children(pair)}
        {#if tabsManager.current.sort_by == pair.method}
            <div class="badge badge-neutral">{i18n.t("pallete.active", { ns: "ui" })}</div>
        {/if}
    {/snippet}
</PalleteBase>
