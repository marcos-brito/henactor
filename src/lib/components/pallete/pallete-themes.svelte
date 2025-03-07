<script lang="ts">
    import { configManager, i18n } from "$lib";
    import PalleteBase from "./pallete-base.svelte";
</script>

<PalleteBase
    name="pallete:themes"
    items={configManager.themes}
    getFn={(t) => t.name}
    executor={async (t) => {
        configManager.config.options.current_theme = t.name;
    }}
>
    {#snippet children(theme)}
        {#if theme.name == configManager.currentTheme?.name}
            <div class="badge badge-neutral">{i18n.t("pallete.active", { ns: "ui" })}</div>
        {/if}
    {/snippet}
</PalleteBase>
