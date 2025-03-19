<script lang="ts">
    import { FilterIcon } from "lucide-svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { i18n, modalManager } from "$lib";
</script>

<button onclick={() => modalManager.show("filterBox")} class="btn btn-ghost font-normal">
    <IconWithFallback size={20} iconName="filter">
        <FilterIcon size="20" />
    </IconWithFallback>
    {i18n.t("toolBar.filter", { ns: "ui" })}
</button>
