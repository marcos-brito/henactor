<script lang="ts">
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { PencilIcon, XIcon } from "lucide-svelte";
    import Base from ".";
    import { i18n, modalManager, opener } from "$lib";
    import Modal from "$lib/components/modal.svelte";

    let {
        pattern,
        app,
    }: {
        pattern: string;
        app: string;
    } = $props();

    let editOpener = $state({ pattern, app });
</script>

<Modal
    onSubmit={() => {
        opener.remove(pattern);
        opener.new(editOpener.pattern, editOpener.app);
    }}
    name="editOpener"
>
    <article class="flex flex-col gap-4">
        <h1>{i18n.t("openers.form.edit", { ns: "settings" })}</h1>
        <div class="flex flex-col gap-2">
            <fieldset class="fieldset">
                <legend class="fieldset-legend"
                    >{i18n.t("openers.form.fields.pattern", { ns: "settings" })}</legend
                >
                <input type="text" bind:value={editOpener.pattern} class="input w-full" />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="fieldset-legend"
                    >{i18n.t("openers.form.fields.app", { ns: "settings" })}</legend
                >
                <input type="text" bind:value={editOpener.app} class="input w-full" />
            </fieldset>
            <button class="btn" type="submit">{i18n.t("done", { ns: "settings" })}</button>
        </div>
    </article>
</Modal>

<Base name={pattern} desc={i18n.t("openers.opensWith", { ns: "settings", app })}>
    <article class="flex gap-2">
        <div
            class="tooltip tooltip-bottom"
            data-tip={i18n.t("settings.editOpener", { ns: "tooltip" })}
        >
            <button
                type="button"
                onclick={() => modalManager.show("editOpener")}
                class="btn btn-circle btn-ghost btn-sm opacity-70"
            >
                <IconWithFallback iconName="edit" size={16}>
                    <PencilIcon size={16} />
                </IconWithFallback>
            </button>
        </div>
        <div
            class="tooltip tooltip-left"
            data-tip={i18n.t("settings.removeOpener", { ns: "tooltip" })}
        >
            <button
                type="button"
                onclick={() => opener.remove(pattern)}
                class="btn btn-circle btn-ghost btn-sm opacity-70"
            >
                <IconWithFallback iconName="x" size={16}>
                    <XIcon size={16} />
                </IconWithFallback>
            </button>
        </div>
    </article>
</Base>
