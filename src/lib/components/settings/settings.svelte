<script lang="ts">
    import { _, dictionary } from "svelte-i18n";
    import { config } from "$lib/config.svelte";
    import SettingsInput from "./settings-input.svelte";
    import SettingsCheck from "./settings-check.svelte";
    import SettingsSelect from "./settings-select.svelte";
    import SettingsKey from "./settings-key.svelte";
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
    <article>
        <SettingsSelect
            bind:value={config.options.lang}
            options={Object.keys($dictionary)}
            name={$_("config.general.lang")}
            desc={$_("config.general.lang.desc")}
        />
        <SettingsCheck
            bind:checked={config.options.download_icons}
            name={$_("config.general.download_icons")}
            desc={$_("config.general.download_icons.desc")}
        />
        <SettingsCheck
            bind:checked={config.options.auto_reload}
            name={$_("config.general.auto_reload")}
            desc={$_("config.general.auto_reload.desc")}
        />
        <SettingsCheck
            bind:checked={config.options.save_on_change}
            name={$_("config.general.save_on_change")}
            desc={$_("config.general.save_on_change.desc")}
        />
    </article>
{/snippet}

{#snippet appearance()}
    <article>
        <SettingsInput
            bind:value={config.options.title}
            name={$_("config.general.title")}
            desc={$_("config.general.title.desc")}
        />
        <SettingsSelect
            bind:value={config.options.current_theme}
            options={config.themes.map((t) => t.name)}
            name={$_("config.appearance.theme")}
            desc={$_("config.appearance.theme.desc")}
        />
    </article>
{/snippet}

{#snippet pins()}
{/snippet}

{#snippet keybinds()}
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
