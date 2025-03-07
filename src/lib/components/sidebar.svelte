<script lang="ts">
    import Pin from "$lib/components/pin.svelte";
    import { configManager, i18n, modalManager } from "$lib";
    import IconWithFallback from "./icon/icon-with-fallback.svelte";
    import { SettingsIcon, TerminalIcon } from "lucide-svelte";
</script>

<aside>
    <ul class="menu">
        {#if configManager.config.options.title}
            <h1 class="title mb-8 text-3xl">{configManager.config.options.title}</h1>
        {/if}
        <li class="menu-title">{i18n.t("words.pins", { ns: "ui" })}</li>
        {#each configManager.config.pins as pin}
            <Pin {pin} />
        {/each}
        <details open>
            <summary class="menu-title">Tools</summary>
            <ul>
                <li>
                    <button onclick={() => modalManager.show("pallete:commands")}>
                        <IconWithFallback size={16} iconName="commands">
                            <TerminalIcon size="16" />
                        </IconWithFallback>
                        Commands
                    </button>
                </li>
                <li>
                    <button onclick={() => modalManager.show("settings")}>
                        <IconWithFallback size={16} iconName="settings">
                            <SettingsIcon size="16" />
                        </IconWithFallback>
                        Settings</button
                    >
                </li>
            </ul>
        </details>
    </ul>
</aside>
