<script lang="ts">
    import { PlusIcon, XIcon, RotateCcwIcon } from "lucide-svelte";
    import Base from ".";
    import Keygrabber from "../keygrabber.svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import Keybind from "$lib/components/keybind.svelte";
    import { type Command } from "$lib/services/command";
    import { i18n } from "$lib";
    import type { FuseResult } from "fuse.js";

    let {
        cmd,
        result,
        value = $bindable(),
    }: {
        cmd: Command;
        result?: FuseResult<{ name: string; desc: string }>;
        value: Array<string>;
    } = $props();

    let grabbing = $state(false);
</script>

<Base name={cmd.name} desc={cmd.desc} {result}>
    <div class="flex gap-4 p-4">
        {#if value.length == 0}
            <div class="bg-base-200 flex items-center gap-1 rounded-sm px-2 py-[2px]">Blank</div>
        {/if}
        <div class="flex max-w-xs gap-4">
            {#each value as keybind}
                <Keybind {cmd} {keybind}>
                    <div
                        class="tooltip tooltip-bottom"
                        data-tip={i18n.t("settings.removeKeybind", { ns: "tooltip" })}
                    >
                        <button
                            type="button"
                            onclick={() => (value = value.filter((k) => k != keybind))}
                            class="btn btn-circle btn-ghost btn-xs opacity-70"
                        >
                            <IconWithFallback iconName="x" size={14}>
                                <XIcon size="14" />
                            </IconWithFallback>
                        </button>
                    </div>
                </Keybind>
            {/each}
        </div>
        <Keygrabber
            bind:grabbing
            callback={(grabbed) => {
                if (!value.includes(grabbed)) value.push(grabbed);
            }}
        />
        <div
            class="tooltip tooltip-bottom"
            data-tip={i18n.t("settings.addKeybind", { ns: "tooltip" })}
        >
            <button
                type="button"
                onclick={() => (grabbing = true)}
                class="btn btn-circle btn-ghost btn-xs opacity-70"
            >
                <IconWithFallback iconName="plus" size={16}>
                    <PlusIcon size="16" />
                </IconWithFallback>
            </button>
        </div>
        <div
            class="tooltip tooltip-left"
            data-tip={i18n.t("settings.resetKeybind", { ns: "tooltip" })}
        >
            <button
                type="button"
                onclick={() => (value = cmd.keybinds)}
                class="btn btn-circle btn-ghost btn-xs opacity-70"
            >
                <IconWithFallback iconName="rotate" size={16}>
                    <RotateCcwIcon size="16" />
                </IconWithFallback>
            </button>
        </div>
    </div>
</Base>
