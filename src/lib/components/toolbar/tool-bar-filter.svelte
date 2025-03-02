<script lang="ts">
    import { FilterIcon } from "lucide-svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { i18n } from "$lib";

    let { filter = $bindable() }: { filter: string } = $props();
</script>

<article class="dropdown">
    <div tabindex="0" role="button" class="btn btn-ghost font-normal">
        <IconWithFallback size={20} iconName="sort">
            <FilterIcon size="20" />
        </IconWithFallback>
        {i18n.t("toolBar.filter", { ns: "ui" })}
    </div>
    <ul
        tabindex="0"
        class="menu dropdown-content z-50 w-52 rounded-box bg-base-200 p-2 shadow-sm"
    ></ul>
</article>
