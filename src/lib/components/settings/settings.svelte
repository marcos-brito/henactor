<script lang="ts">
    import { _, dictionary } from "svelte-i18n";
    import { app } from "$lib/app.svelte";
    import SettingsInput from "./settings-input.svelte";
    import SettingsCheck from "./settings-check.svelte";
    import SettingsSelect from "./settings-select.svelte";
    import SettingsKey from "./settings-key.svelte";
    import { type Command } from "$lib/bindings";
    import type { Snippet } from "svelte";

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
        name={$_("config.general.lang")}
        desc={$_("config.general.lang.desc")}
    />
    <SettingsCheck
        bind:checked={app.options.download_icons}
        name={$_("config.general.download_icons")}
        desc={$_("config.general.download_icons.desc")}
    />
    <SettingsCheck
        bind:checked={app.options.auto_reload}
        name={$_("config.general.auto_reload")}
        desc={$_("config.general.auto_reload.desc")}
    />
    <SettingsCheck
        bind:checked={app.options.save_on_change}
        name={$_("config.general.save_on_change")}
        desc={$_("config.general.save_on_change.desc")}
    />
{/snippet}

{#snippet appearance()}
    <SettingsInput
        bind:value={app.options.title}
        name={$_("config.general.title")}
        desc={$_("config.general.title.desc")}
    />
    <SettingsSelect
        bind:value={app.options.current_theme}
        options={app.themes.map((t) => t.name)}
        name={$_("config.appearance.theme")}
        desc={$_("config.appearance.theme.desc")}
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
                        onclick={() => (currentPage = page)}>{$_(`config.${page}`)}</button
                    >
                </li>
            {/each}
        </ul>
    </aside>
    <main class="h-[80vh] overflow-auto">
        {@render currentPageContent()}
    </main>
</section>
