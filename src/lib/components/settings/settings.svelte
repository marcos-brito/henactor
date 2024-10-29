<script lang="ts">
    import { _ } from "svelte-i18n";
    import { app } from "$lib/app.svelte";
    import SettingsInput from "./settings-input.svelte";
    import SettingsCheck from "./settings-check.svelte";
    import SettingsSelect from "./settings-select.svelte";
    import SettingsKey from "./settings-key.svelte";
    import { type Command } from "$lib/bindings";
    import type { Snippet } from "svelte";
    import { dictionary } from "$lib/locale.svelte";
    import SettingsPopup from "./settings-popup.svelte";

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
        options={Object.keys(dictionary.current)}
        name={$_("settings.general.lang")}
        desc={$_("settings.general.lang.desc")}
    />
    <SettingsCheck
        bind:checked={app.options.download_icons}
        name={$_("settings.general.download_icons")}
        desc={$_("settings.general.download_icons.desc")}
    />
    <SettingsCheck
        bind:checked={app.options.auto_reload}
        name={$_("settings.general.auto_reload")}
        desc={$_("settings.general.auto_reload.desc")}
    />
    <SettingsPopup
        name={$_("settings.general.default_tab")}
        desc={$_("settings.general.default_tab.desc")}
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
        bind:value={app.options.default_view}
        options={views}
        name={$_("settings.general.default_view")}
        desc={$_("settings.general.default_view.desc")}
    />
    <SettingsInput
        type="number"
        bind:value={app.options.default_grid_size}
        name={$_("settings.general.default_grid_size")}
        desc={$_("settings.general.default_grid_size.desc")}
    />
{/snippet}

{#snippet appearance()}
    <SettingsInput
        type="text"
        bind:value={app.options.title}
        name={$_("settings.general.title")}
        desc={$_("settings.general.title.desc")}
    />
    <SettingsSelect
        bind:value={app.options.current_theme}
        options={app.themes.map((t) => t.name)}
        name={$_("settings.appearance.theme")}
        desc={$_("settings.appearance.theme.desc")}
    />
{/snippet}

{#snippet pins()}
    <p>a</p>
{/snippet}

{#snippet keybinds()}
    {#each Object.keys(app.keybinds) as cmd}
        <SettingsKey name={cmd} desc="" bind:value={app.keybinds[cmd as Command]} />
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
                        onclick={() => (currentPage = page)}>{$_(`settings.${page}`)}</button
                    >
                </li>
            {/each}
        </ul>
    </aside>
    <main class="h-[80vh] overflow-auto">
        {@render currentPageContent()}
    </main>
</section>
