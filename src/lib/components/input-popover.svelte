<script lang="ts">
    import { modalManager } from "$lib";
    import type { Snippet } from "svelte";

    let {
        children,
        name,
        value = $bindable(),
    }: { children: Snippet; name: string; value: string } = $props();
    let input: HTMLInputElement;
    let popover: HTMLElement;
    let valueBeforeChange = value;
    let confirmed = false;

    $effect(() => {
        modalManager.register({
            name,
            show: () => popover.showPopover(),
            hide: () => popover.hidePopover(),
        });
    });
</script>

<section
    popover="auto"
    bind:this={popover}
    class="bg-base-200 absolute top-[80%] left-[80%] rounded-md px-4 py-2"
    ontoggle={(event) => {
        if (event.newState == "open") {
            input.focus();
            valueBeforeChange = value;
            confirmed = false;
            return;
        }

        if (!confirmed) value = valueBeforeChange;
        modalManager.hide(name);
    }}
>
    <form
        onsubmit={() => {
            confirmed = true;
            popover.hidePopover();
        }}
    >
        <fieldset class="fieldset">
            <legend class="fieldset-legend">
                {@render children()}
            </legend>
            <input
                bind:this={input}
                type="text"
                class="input bg-base-200 text-base-content"
                bind:value
            />
        </fieldset>
    </form>
</section>
