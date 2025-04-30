<script lang="ts">
    import { configManager, i18n } from "$lib";
    import Base from ".";
</script>

<Base
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
</Base>
