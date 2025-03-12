<script lang="ts">
    import type { Snippet } from "svelte";
    import Modal from "$lib/components/modal.svelte";
    import ItemBase from "./item-base.svelte";
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

<ItemBase {name} {desc}>
    <div>
        <button class="btn btn-sm" type="button" onclick={() => modalManager.show(modalName)}
            >{i18n.t("configure", { ns: "settings" })}</button
        >
    </div>
    <Modal name={modalName} {modalManager}>
        <div class="mb-2">
            <h1 class="text-lg font-bold">{name}</h1>
            <p class="opacity-70">{desc}</p>
        </div>
        {@render children()}
    </Modal>
</ItemBase>
