<script lang="ts">
    import { configManager, i18n, modalManager, opener } from "$lib";
    import Modal from "$lib/components/modal.svelte";
    import { ItemOpener } from "../item";

    const openers = $derived(Object.entries(configManager.config.openers));
    let newOpener = $state({ pattern: "", app: "" });
</script>

<Modal
    onSubmit={() => {
        opener.new(newOpener.pattern, newOpener.app);
        newOpener.pattern = "";
        newOpener.app = "";
    }}
    name="newOpener"
    {modalManager}
>
    <artcile class="flex flex-col gap-4">
        <h1>{i18n.t("openers.form.new", { ns: "settings" })}</h1>
        <div class="flex flex-col gap-2">
            <fieldset class="fieldset">
                <legend class="fieldset-legend"
                    >{i18n.t("openers.form.fields.pattern", { ns: "settings" })}</legend
                >
                <input type="text" bind:value={newOpener.pattern} class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="fieldset-legend"
                    >{i18n.t("openers.form.fields.app", { ns: "settings" })}</legend
                >
                <input type="text" bind:value={newOpener.app} class="input w-full" />
            </fieldset>
            <button class="btn" type="submit">{i18n.t("done", { ns: "settings" })}</button>
        </div>
    </artcile>
</Modal>
<section class="flex flex-col gap-6">
    <article class="flex justify-between">
        <div>
            <h1>{i18n.t("openers.name", { ns: "settings" })}</h1>
            <p class="text-xs">{i18n.t("openers.message", { ns: "settings" })}</p>
        </div>
        <button type="button" onclick={() => modalManager.show("newOpener")} class="btn"
            >{i18n.t("openers.form.new", { ns: "settings" })}</button
        >
    </article>
    <article>
        {#if openers.length == 0}
            <h1>{i18n.t("openers.noneDefined", { ns: "settings" })}</h1>
        {/if}
        {#each openers as [pattern, app]}
            <ItemOpener {pattern} {app} />
        {/each}
    </article>
</section>
