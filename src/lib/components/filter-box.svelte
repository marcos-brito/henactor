<script lang="ts">
    import { i18n, modalManager } from "$lib";

    let { filter = $bindable() }: { filter: string } = $props();
    let input: HTMLInputElement;
    let popover: HTMLElement;
    let filterBeforeChange = filter;
    let confirmed = false;

    $effect(() => {
        modalManager.register({ name: "filterBox", show: () => popover.showPopover() });
        popover.addEventListener("toggle", (event) => {
            if (event.newState == "open") {
                input.focus();
                filterBeforeChange = filter;
                confirmed = false;
                return;
            }

            if (!confirmed) filter = filterBeforeChange;
        });
    });
</script>

<section
    popover="auto"
    bind:this={popover}
    class="bg-base-200 absolute top-[80%] left-[80%] rounded-md px-4 py-2"
>
    <form
        onsubmit={() => {
            confirmed = true;
            popover.hidePopover();
        }}
    >
        <fieldset class="fieldset">
            <legend class="fieldset-legend">{i18n.t("toolBar.filter", { ns: "ui" })}</legend>
            <input
                bind:this={input}
                type="text"
                class="input bg-base-200 text-base-content"
                bind:value={filter}
            />
        </fieldset>
    </form>
</section>
