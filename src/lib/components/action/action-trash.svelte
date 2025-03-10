<script lang="ts">
    import type { Hook } from "$lib/services";
    import Modal from "$lib/components/modal.svelte";
    import { i18n, modalManager } from "$lib";
    import { fileName } from "$lib/utils";
    import Truncate from "$lib/components/truncate.svelte";

    let paths = $state<Array<string>>([]);
    let hook = $state<Hook<Array<string>>>();
</script>

<Modal
    {modalManager}
    onSubmit={() => {
        if (hook && paths.length > 0) hook(paths);
    }}
    name="action:trash"
    bind:hook
    bind:params={paths}
>
    <section class="flex flex-col gap-4">
        <article class="flex items-end gap-2">
            <h1 class="text-xl">{i18n.t("actions.trash.title", { ns: "modals" })}</h1>
            {#if paths.length == 1}
                <Truncate value={fileName(paths[0])} class="text-sm opacity-70" />
            {:else}
                <p class="text-sm opacity-70">
                    {i18n.t("actions.itemCount", { ns: "modals", count: paths.length })}
                </p>
            {/if}
        </article>
        {#if paths.length == 1}
            <p>{i18n.t("actions.trash.message", { ns: "modals" })}</p>
        {:else}
            <p>{i18n.t("actions.trash.messageMany", { ns: "modals", count: paths.length })}</p>
        {/if}
        <button type="submit" class="btn w-full"
            >{i18n.t("actions.trash.confirmation", { ns: "modals" })}</button
        >
    </section>
</Modal>
