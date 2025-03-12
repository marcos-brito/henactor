<script lang="ts">
    import { i18n, configManager } from "$lib";
    import ItemInput from "../item/item-input.svelte";
    import ItemSelect from "../item/item-select.svelte";
</script>

<ItemInput
    type="text"
    bind:value={configManager.config.options.title}
    name={i18n.t("appearance.options.title.name", { ns: "settings" })}
    desc={i18n.t("appearance.options.title.desc", { ns: "settings" })}
/>
<ItemInput
    type="number"
    bind:value={configManager.config.options.truncation_limit}
    name={i18n.t("appearance.options.truncationLimit.name", { ns: "settings" })}
    desc={i18n.t("appearance.options.truncationLimit.desc", { ns: "settings" })}
/>
<ItemSelect
    bind:value={configManager.config.options.current_theme}
    options={configManager.themes.map((t) => t.name)}
    name={i18n.t("appearance.options.theme.name", { ns: "settings" })}
    desc={i18n.t("appearance.options.theme.desc", { ns: "settings" })}
/>
