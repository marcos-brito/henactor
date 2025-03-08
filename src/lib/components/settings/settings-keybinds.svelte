<script lang="ts">
    import { i18n, commandRegister, configManager } from "$lib";
    import Fuse from "fuse.js";
    import SettingsCmd from "./settings-cmd.svelte";
    import Keygrabber from "./keygrabber.svelte";
    import { KeyboardIcon, XIcon } from "lucide-svelte";
    import { IconWithFallback } from "../icon";
    import Keybind from "../keybind.svelte";
    import type { Command } from "$lib/services";

    const commands = $derived(Array.from(commandRegister.commands.values()));

    let keyFilters = $state<Array<string>>([]);
    let query = $state("");
    let grabbing = $state(false);
    const results = $derived(
        new Fuse(commands, {
            includeMatches: true,
            keys: [
                { name: "name", getFn: (c) => c.name },
                { name: "desc", getFn: (c) => c.desc },
            ],
        }).search(query),
    );

    // We take keyFilters as param so the ui can update
    function shouldShow(cmd: Command, keyFilters: Array<string>): boolean {
        if (keyFilters.length < 1) return true;
        return cmd.keybinds.some((keybind) => keyFilters.includes(keybind));
    }
</script>

<section class="flex flex-col gap-6">
    <article class="flex items-center justify-between">
        <div>
            <p>{i18n.t("keybinds.commmandCount", { ns: "settings", count: commands.length })}</p>
            <p class="text-xs">{i18n.t("keybinds.defaultsMessage", { ns: "settings" })}</p>
        </div>
        <div class="flex w-1/2 items-center gap-2">
            <input
                class="input input-sm"
                bind:value={query}
                placeholder={i18n.t("keybinds.placeholder", { ns: "settings" })}
            />
            <Keygrabber
                bind:grabbing
                callback={(grabbed) => {
                    if (!keyFilters.includes(grabbed)) keyFilters.push(grabbed);
                }}
            />
            <div
                class:hidden={grabbing}
                class="tooltip tooltip-left"
                data-tip={i18n.t("settings.keybindFilter", { ns: "tooltip" })}
            >
                <button
                    type="button"
                    onclick={() => (grabbing = true)}
                    class="btn btn-circle btn-ghost btn-xs"
                >
                    <IconWithFallback iconName="keyboard" size={16}>
                        <KeyboardIcon size="16" />
                    </IconWithFallback>
                </button>
            </div>
        </div>
    </article>
    <article class="flex flex-col gap-4">
        {#if keyFilters.length > 0}
            <div class="flex items-center gap-2">
                <p>Filters</p>
                <div
                    class:hidden={grabbing}
                    class="tooltip tooltip-bottom"
                    data-tip={i18n.t("settings.clearFilters", { ns: "tooltip" })}
                >
                    <button
                        type="button"
                        onclick={() => (keyFilters = [])}
                        class="btn btn-circle btn-ghost btn-xs"
                    >
                        <IconWithFallback iconName="x" size={16}>
                            <XIcon size="16" />
                        </IconWithFallback>
                    </button>
                </div>
            </div>
            <div class="flex gap-2">
                {#each keyFilters as keybind}
                    <Keybind {keybind}>
                        <div
                            class="tooltip tooltip-right"
                            data-tip={i18n.t("settings.removeFilter", { ns: "tooltip" })}
                        >
                            <button
                                type="button"
                                onclick={() =>
                                    (keyFilters = keyFilters.filter((k) => k != keybind))}
                                class="btn btn-circle btn-ghost btn-xs"
                            >
                                <IconWithFallback iconName="x" size={16}>
                                    <XIcon size="16" />
                                </IconWithFallback>
                            </button>
                        </div>
                    </Keybind>
                {/each}
            </div>
        {/if}
    </article>
    <article>
        {#if query}
            {#each results.filter((r) => shouldShow(r.item, keyFilters)) as result}
                <SettingsCmd
                    {result}
                    cmd={result.item}
                    bind:value={configManager.config.keybinds[result.item.identifier]}
                />
                <div class="divider my-0"></div>
            {/each}
        {:else}
            {#each commands.filter((r) => shouldShow(r, keyFilters)) as cmd}
                <SettingsCmd {cmd} bind:value={configManager.config.keybinds[cmd.identifier]} />
                <div class="divider my-0"></div>
            {/each}
        {/if}
    </article>
</section>
