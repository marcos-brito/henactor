<script lang="ts">
    import { i18n, configManager } from "$lib";
    import * as Items from "../items";

    const views = ["Grid", "List", "Tree"];
</script>

<Items.Select
    bind:value={configManager.config.options.lang}
    options={i18n.languages}
    name={i18n.t("general.options.lang.name", { ns: "settings" })}
    desc={i18n.t("general.options.lang.desc", { ns: "settings" })}
    onChange={(lang) => {
        i18n.changeLanguage(lang);
    }}
/>
<Items.Check
    bind:checked={configManager.config.options.download_icons}
    name={i18n.t("general.options.downloadIcons.name", { ns: "settings" })}
    desc={i18n.t("general.options.downloadIcons.desc", { ns: "settings" })}
/>
<Items.Check
    bind:checked={configManager.config.options.auto_reload}
    name={i18n.t("general.options.autoReload.name", { ns: "settings" })}
    desc={i18n.t("general.options.autoReload.desc", { ns: "settings" })}
/>
<Items.Check
    bind:checked={configManager.config.options.commit_mode}
    name={i18n.t("general.options.commitMode.name", { ns: "settings" })}
    desc={i18n.t("general.options.commitMode.desc", { ns: "settings" })}
/>
<Items.Input
    type="number"
    bind:value={configManager.config.options.delete_timeout}
    name={i18n.t("general.options.deleteTimeout.name", { ns: "settings" })}
    desc={i18n.t("general.options.deleteTimeout.desc", { ns: "settings" })}
/>
<Items.Popup
    name={i18n.t("general.options.defaultTab.name", { ns: "settings" })}
    desc={i18n.t("general.options.defaultTab.desc", { ns: "settings" })}
>
    <label class="form-control w-full max-w-xs">
        <div class="label">
            <span class="label-text"
                >{i18n.t("general.options.defaultTab.fields.name", { ns: "settings" })}</span
            >
        </div>
        <input
            class="input input-sm input-bordered"
            type="text"
            bind:value={configManager.config.options.default_tab.name}
        />
    </label>
    <label class="form-control w-full max-w-xs">
        <div class="label">
            <span class="label-text"
                >{i18n.t("general.options.defaultTab.fields.path", { ns: "settings" })}</span
            >
        </div>
        <input
            class="input input-sm input-bordered"
            type="text"
            bind:value={configManager.config.options.default_tab.path}
        />
    </label>
</Items.Popup>
<Items.Select
    bind:value={configManager.config.options.default_tab.view}
    options={views}
    name={i18n.t("general.options.defaultView.name", { ns: "settings" })}
    desc={i18n.t("general.options.defaultView.desc", { ns: "settings" })}
/>
<Items.Input
    type="number"
    bind:value={configManager.config.options.default_tab.grid_size}
    name={i18n.t("general.options.defaultGridSize.name", { ns: "settings" })}
    desc={i18n.t("general.options.defaultGridSize.desc", { ns: "settings" })}
/>
