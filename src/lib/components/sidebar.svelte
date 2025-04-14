<script lang="ts">
    import Pin from "$lib/components/pin.svelte";
    import { configManager, i18n, modalManager, taskManager } from "$lib";
    import IconWithFallback from "./icon/icon-with-fallback.svelte";
    import { HistoryIcon, ListTodoIcon, SettingsIcon, TerminalIcon } from "lucide-svelte";
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
            <summary class="menu-title">{i18n.t("sidebar.tools.title", { ns: "ui" })}</summary>
            <ul>
                <li>
                    <button onclick={() => modalManager.show("pallete:commands")}>
                        <IconWithFallback size={16} iconName="commands">
                            <TerminalIcon size="16" />
                        </IconWithFallback>
                        {i18n.t("sidebar.tools.items.commands", { ns: "ui" })}
                    </button>
                </li>
                <li>
                    <button onclick={() => modalManager.show("settings")}>
                        <IconWithFallback size={16} iconName="settings">
                            <HistoryIcon size="16" />
                        </IconWithFallback>
                        {i18n.t("sidebar.tools.items.history", { ns: "ui" })}
                    </button>
                </li>
                <li>
                    <button onclick={() => modalManager.show("tasks")}>
                        <IconWithFallback size={16} iconName="settings">
                            <ListTodoIcon size="16" />
                        </IconWithFallback>
                        <div class="indicator">
                            {#if Array.from(taskManager.tasks.values()).length > 0}
                                <span class="indicator-item indicator-middle badge badge-xs"
                                    >{Array.from(taskManager.tasks.values()).length}</span
                                >
                            {/if}
                            <p class="mr-4">
                                {i18n.t("sidebar.tools.items.tasks", { ns: "ui" })}
                            </p>
                        </div>
                    </button>
                </li>
                <li>
                    <button onclick={() => modalManager.show("settings")}>
                        <IconWithFallback size={16} iconName="settings">
                            <SettingsIcon size="16" />
                        </IconWithFallback>
                        {i18n.t("sidebar.tools.items.settings", { ns: "ui" })}
                    </button>
                </li>
            </ul>
        </details>
    </ul>
</aside>
