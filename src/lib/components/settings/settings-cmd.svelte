<script lang="ts">
    import { PlusIcon, XIcon, RotateCcwIcon } from "lucide-svelte";
    import SettingsField from "./settings-field.svelte";
    import Keygrabber from "./keygrabber.svelte";
    import IconWithFallback from "../icon/icon-with-fallback.svelte";
    import Keybind from "../keybind.svelte";
    import type { Command } from "$lib/services";

    let {
        cmd,
        value = $bindable(),
    }: {
        cmd: Command;
        value: Array<string>;
    } = $props();

    let grabbing = $state(false);
</script>

<SettingsField name={cmd.name} desc={cmd.desc}>
    <div class="flex gap-4 p-4">
        {#if value.length == 0}
            <div class="bg-base-200 flex items-center gap-1 rounded-sm px-2 py-[2px]">Blank</div>
        {/if}
        <div class="flex max-w-xs gap-4 overflow-auto">
            {#each value as keybind}
                <Keybind {keybind}>
                    <button
                        type="button"
                        onclick={() => (value = value.filter((k) => k != keybind))}
                        class="btn btn-circle btn-ghost btn-xs opacity-70"
                    >
                        <IconWithFallback iconName="x" size={14}>
                            <XIcon size="14" />
                        </IconWithFallback>
                    </button>
                </Keybind>
            {/each}
        </div>
        <Keygrabber
            bind:grabbing
            callback={(grabbed) => {
                if (!value.includes(grabbed)) value.push(grabbed);
            }}
        />
        <button
            type="button"
            onclick={() => (grabbing = true)}
            class="btn btn-circle btn-ghost btn-xs opacity-70"
        >
            <IconWithFallback iconName="plus" size={16}>
                <PlusIcon size="16" />
            </IconWithFallback>
        </button>
        <button
            type="button"
            onclick={() => (value = cmd.keybinds)}
            class="btn btn-circle btn-ghost btn-xs opacity-70"
        >
            <IconWithFallback iconName="plus" size={16}>
                <RotateCcwIcon size="16" />
            </IconWithFallback>
        </button>
    </div>
</SettingsField>
