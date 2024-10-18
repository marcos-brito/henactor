<script lang="ts">
    import { PlusIcon, XIcon } from "lucide-svelte";
    import SettingsField from "./settings-field.svelte";
    import Keygrabber from "./keygrabber.svelte";
    import IconWithFallback from "../icon/icon-with-fallback.svelte";

    let {
        name,
        desc,
        value = $bindable(),
    }: {
        name: string;
        desc: string;
        value: Array<string>;
    } = $props();

    let isGrabbing = $state(false);
    const keyAliases: Record<string, string> = {
        Control: "Ctrl",
        " ": "Space",
        ArrowUp: "▲",
        ArrowDown: "▼",
        ArrowLeft: "◀︎",
        ArrowRight: "▶︎",
    };
</script>

{#snippet keyBindText(keybind: string)}
    <div class="flex gap-1 text-sm">
        {#each keybind.split("+") as key, i}
            <p class="capitalize">{keyAliases[key] || key}</p>
            {#if i != keybind.split("+").length - 1}
                <p>+</p>
            {/if}
        {/each}
    </div>
{/snippet}

<SettingsField {name} {desc}>
    <div class="flex gap-4">
        {#if value.length == 0}
            <div class="flex items-center gap-1 rounded bg-base-200 px-2 py-[2px]">Blank</div>
        {/if}
        <div class="flex max-w-md gap-4 overflow-auto">
            {#each value as keybind}
                <div class="flex items-center gap-1 rounded bg-base-200 px-2 py-[2px]">
                    {@render keyBindText(keybind)}
                    <button
                        onclick={() => (value = value.filter((k) => k != keybind))}
                        class="btn btn-circle btn-ghost btn-xs opacity-70"
                    >
                        <IconWithFallback iconName="x" size={14}>
                            <XIcon size="14" />
                        </IconWithFallback>
                    </button>
                </div>
            {/each}
        </div>
        {#if isGrabbing}
            <Keygrabber
                callback={(grabbed) => {
                    if (grabbed) value.push(grabbed);
                    console.log(grabbed);
                    isGrabbing = false;
                }}
            />
        {:else}
            <button
                onclick={() => (isGrabbing = true)}
                class="btn btn-circle btn-ghost btn-xs opacity-70"
            >
                <IconWithFallback iconName="plus" size={16}>
                    <PlusIcon size="16" />
                </IconWithFallback>
            </button>
        {/if}
    </div>
</SettingsField>
