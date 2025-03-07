<script lang="ts">
    import type { Hook } from "$lib/services";
    import Modal from "$lib/components/modal.svelte";
    import { i18n, modalManager } from "$lib";
    import type { Tab } from "$lib/bindings";

    let tab = $state<Tab>();
    let hook = $state<Hook<string>>();
    let value = $state("");
    let input: HTMLInputElement;

    // WARN: This should work once the fix from daisy ui is merged
    $effect(() => {
        input.focus();
    });

    $effect(() => {
        if (tab) {
            value = tab.name;
            input.setSelectionRange(0, tab.name.length);
        }
    });

    $effect(() => {});
</script>

<Modal
    {modalManager}
    onSubmit={() => {
        if (hook && value) hook(value);
    }}
    name="renameTab"
    bind:hook
    bind:params={tab}
>
    <div class="flex flex-col gap-4">
        <h1>{i18n.t("renameTab.title", { ns: "modals" })}</h1>
        <input bind:this={input} class="input w-full" bind:value />
        <button type="submit" class="btn w-full"
            >{i18n.t("renameTab.confirmation", { ns: "modals" })}</button
        >
    </div>
</Modal>
