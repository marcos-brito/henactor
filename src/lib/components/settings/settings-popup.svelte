<script lang="ts">
    import type { Snippet } from "svelte";
    import Modal from "../modal.svelte";
    import SettingsField from "./settings-field.svelte";
    import { _ } from "svelte-i18n";

    let {
        name,
        desc,
        children,
    }: {
        name: string;
        desc: string;
        children: Snippet;
    } = $props();
</script>

<SettingsField {name} {desc}>
    <Modal>
        {#snippet trigger(dialog: HTMLDialogElement)}
            <button class="btn btn-sm" onclick={() => dialog.showModal()}>{$_("configure")}</button>
        {/snippet}
        <div class="mb-2">
            <h1 class="text-lg font-bold">{name}</h1>
            <p class="opacity-70">{desc}</p>
        </div>
        {@render children()}
    </Modal>
</SettingsField>
