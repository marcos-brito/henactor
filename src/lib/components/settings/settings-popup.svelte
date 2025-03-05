<script lang="ts">
    import type { Snippet } from "svelte";
    import Modal from "../modal.svelte";
    import SettingsField from "./settings-field.svelte";
    import { i18n, modalManager } from "$lib";

    let {
        name,
        desc,
        children,
    }: {
        name: string;
        desc: string;
        children: Snippet;
    } = $props();

    const modalName = `settings.${name}`;
</script>

<SettingsField {name} {desc}>
    <button class="btn btn-sm" type="button" onclick={() => modalManager.show(modalName)}
        >{i18n.t("configure", { ns: "settings" })}</button
    >
    <Modal name={modalName} {modalManager}>
        <div class="mb-2">
            <h1 class="text-lg font-bold">{name}</h1>
            <p class="opacity-70">{desc}</p>
        </div>
        {@render children()}
    </Modal>
</SettingsField>
