<script lang="ts">
    import type { Hook } from "$lib/services";
    import Modal from "$lib/components/modal.svelte";
    import { configManager, i18n, modalManager } from "$lib";
    import { fileName } from "$lib/utils";
    import Truncate from "$lib/components/truncate.svelte";

    let open = $state(false);
    let paths = $state<Array<string>>([]);
    let hook = $state<Hook<Array<string>>>();
    let cooldownDone = $state(false);

    $effect(() => {
        if (open) {
            cooldownDone = false;
            setTimeout(() => (cooldownDone = true), configManager.config.options.delete_timeout);
        }
    });
</script>

<Modal
    onSubmit={() => {
        if (hook && paths.length > 0) hook(paths);
    }}
    name="action:delete"
    bind:hook
    bind:open
    bind:params={paths}
>
    <section class="flex flex-col gap-4">
        <article class="flex items-end gap-2">
            <h1 class="text-xl">{i18n.t("actions.delete.title", { ns: "modals" })}</h1>
            {#if paths.length == 1}
                <Truncate value={fileName(paths[0])} class="text-sm opacity-70" />
            {:else}
                <p class="text-sm opacity-70">
                    {i18n.t("actions.itemCount", { ns: "modals", count: paths.length })}
                </p>
            {/if}
        </article>
        {#if paths.length == 1}
            <p>{i18n.t("actions.delete.message", { ns: "modals" })}</p>
        {:else}
            <p>{i18n.t("actions.delete.messageMany", { ns: "modals", count: paths.length })}</p>
        {/if}
        <button type="submit" disabled={!cooldownDone} class="btn btn-error w-full"
            >{i18n.t("actions.delete.confirmation", { ns: "modals" })}</button
        >
    </section>
</Modal>
