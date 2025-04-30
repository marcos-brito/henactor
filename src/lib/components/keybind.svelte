<script lang="ts">
    import type { Snippet } from "svelte";
    import { findKeyAlias } from "$lib/utils";
    import { commandRegister, i18n } from "$lib";
    import { type Command } from "$lib/services/command";

    let { keybind, cmd, children }: { keybind: string; cmd?: Command; children?: Snippet } =
        $props();

    let conflict = $derived(
        commandRegister
            .find(keybind)
            .filter((c) => c.identifier != cmd?.identifier)
            .map((c) => c.name)
            .at(0),
    );
</script>

<div
    class="tooltip-warning bg-base-200 tooltip-bottom flex items-center gap-1 rounded-sm px-2 py-[2px]"
    class:tooltip={cmd && conflict}
    class:bg-warning={cmd && conflict}
    data-tip={i18n.t("settings.keybindConflict", { ns: "tooltip", keybind: conflict })}
>
    <div class="flex gap-1 text-sm" class:text-warning-content={cmd && conflict}>
        {#each keybind.split("+") as key, i}
            <p class="capitalize">{findKeyAlias(key)}</p>
            {#if i != keybind.split("+").length - 1}
                <p>+</p>
            {/if}
        {/each}
    </div>
    <div class:text-warning-content={cmd && conflict}>
        {#if children}
            {@render children()}
        {/if}
    </div>
</div>
