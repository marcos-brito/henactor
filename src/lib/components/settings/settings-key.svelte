<script lang="ts">
    import { PlusIcon, XIcon } from "lucide-svelte";
    import SettingsField from "./settings-field.svelte";
    import Keygrabber from "./keygrabber.svelte";
    import IconWithFallback from "../icon/icon-with-fallback.svelte";
    import Keybind from "../keybind.svelte";

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
</script>

<SettingsField {name} {desc}>
    <div class="flex gap-4">
        {#if value.length == 0}
            <div class="bg-base-200 flex items-center gap-1 rounded-sm px-2 py-[2px]">Blank</div>
        {/if}
        <div class="flex max-w-md gap-4 overflow-auto">
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
                type="button"
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
