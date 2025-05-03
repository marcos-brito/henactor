<script lang="ts">
    import { i18n } from "$lib";
    import InputPopover from "$lib/components/input-popover.svelte";

    let { query = $bindable() }: { query: string } = $props();
</script>

<InputPopover value={query} name="search:deep">
    {i18n.t("toolBar.search.deepSearch", { ns: "ui" })}
</InputPopover>
