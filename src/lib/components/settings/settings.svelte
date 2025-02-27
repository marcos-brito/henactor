<script lang="ts">
    import { _ } from "svelte-i18n";
    import { app } from "$lib/app.svelte";
    import { commandRegister } from "$lib/index";
    import SettingsInput from "./settings-input.svelte";
    import SettingsCheck from "./settings-check.svelte";
    import SettingsSelect from "./settings-select.svelte";
    import SettingsKey from "./settings-key.svelte";
    import type { Snippet } from "svelte";
    import SettingsPopup from "./settings-popup.svelte";
    import { i18n } from "$lib";

    const views = ["Grid", "List", "Tree"];
    const pages: Record<string, Snippet> = {
        general: general,
        appearance: appearance,
        pins: pins,
        keybinds: keybinds,
    };
    let currentPage = $state("general");
    let currentPageContent = $derived(pages[currentPage]);
</script>

{#snippet general()}
    <SettingsSelect
        bind:value={app.options.lang}
        options={i18n.languages}
        name={i18n.t("general.options.lang.name", { ns: "settings" })}
        desc={i18n.t("general.options.lang.desc", { ns: "settings" })}
        onChange={(lang) => {
            i18n.changeLanguage(lang);
        }}
    />
    <SettingsCheck
        bind:checked={app.options.download_icons}
        name={i18n.t("general.options.downloadIcons.name", { ns: "settings" })}
        desc={i18n.t("general.options.downloadIcons.desc", { ns: "settings" })}
    />
    <SettingsCheck
        bind:checked={app.options.auto_reload}
        name={i18n.t("general.options.autoReload.name", { ns: "settings" })}
        desc={i18n.t("general.options.autoReload.desc", { ns: "settings" })}
    />
    <SettingsPopup
        name={i18n.t("general.options.defaultTab.name", { ns: "settings" })}
        desc={i18n.t("general.options.defaultTab.desc", { ns: "settings" })}
    >
        <label class="form-control w-full max-w-xs">
            <div class="label">
                <span class="label-text">{$_("settings.general.default_tab.name")}</span>
            </div>
            <input
                class="input input-sm input-bordered"
                type="text"
                bind:value={app.options.default_tab.name}
            />
        </label>
        <label class="form-control w-full max-w-xs">
            <div class="label">
                <span class="label-text">{$_("settings.general.default_tab.path")}</span>
            </div>
            <input
                class="input input-sm input-bordered"
                type="text"
                bind:value={app.options.default_tab.path}
            />
        </label>
    </SettingsPopup>
    <SettingsSelect
        bind:value={app.options.default_tab.view}
        options={views}
        name={i18n.t("general.options.defaultView.name", { ns: "settings" })}
        desc={i18n.t("general.options.defaultView.desc", { ns: "settings" })}
    />
    <SettingsInput
        type="number"
        bind:value={app.options.default_tab.grid_size}
        name={i18n.t("general.options.defaultGridSize.name", { ns: "settings" })}
        desc={i18n.t("general.options.defaultGridSize.desc", { ns: "settings" })}
    />
{/snippet}

{#snippet appearance()}
    <SettingsInput
        type="text"
        bind:value={app.options.title}
        name={i18n.t("appearance.options.title.name", { ns: "settings" })}
        desc={i18n.t("appearance.options.title.desc", { ns: "settings" })}
    />
    <SettingsInput
        type="number"
        bind:value={app.options.truncation_limit}
        name={i18n.t("appearance.options.truncationLimit.name", { ns: "settings" })}
        desc={i18n.t("appearance.options.truncationLimit.desc", { ns: "settings" })}
    />
    <SettingsSelect
        bind:value={app.options.current_theme}
        options={app.themes.map((t) => t.name)}
        name={i18n.t("appearance.options.theme.name", { ns: "settings" })}
        desc={i18n.t("appearance.options.theme.desc", { ns: "settings" })}
    />
{/snippet}

{#snippet pins()}
    <p>a</p>
{/snippet}

{#snippet keybinds()}
    {#each commandRegister.all().sort((a, b) => a.name.localeCompare(b.name)) as cmd}
        <SettingsKey name={cmd.name} desc={cmd.desc} bind:value={cmd.keybinds} />
        <div class="divider my-0"></div>
    {/each}
{/snippet}

<section class="mt-4 grid grid-cols-[200px_1fr]">
    <aside class="h-[80vh] overflow-auto">
        <ul class="menu">
            {#each Object.keys(pages) as page}
                <li>
                    <button
                        class={page == currentPage ? "active" : ""}
                        onclick={() => (currentPage = page)}
                        >{i18n.t(`settings:${page}.name`)}</button
                    >
                </li>
            {/each}
        </ul>
    </aside>
    <main class="h-[80vh] overflow-auto">
        {@render currentPageContent()}
    </main>
</section>
