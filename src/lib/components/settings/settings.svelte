<script lang="ts">
    import { i18n } from "$lib";
    import Modal from "../modal.svelte";
    import type { ModalManager } from "$lib/services";
    import SettingsKeybinds from "./settings-keybinds.svelte";
    import SettingsGeneral from "./settings-general.svelte";
    import SettingsAppearence from "./settings-appearence.svelte";

    let { modalManager }: { modalManager: ModalManager } = $props();

    const pages = ["general", "appearance", "pins", "keybinds"] as const;
    let currentPage: (typeof pages)[number] = $state("general");
</script>

<Modal name="settings" {modalManager} class="max-w-5xl">
    <section class="mt-4 grid grid-cols-[150px_1fr]">
        <aside class="h-[80vh] overflow-auto">
            <ul class="menu">
                {#each pages as page}
                    <li>
                        <button
                            type="button"
                            class={page == currentPage ? "active" : ""}
                            onclick={() => (currentPage = page)}
                            >{i18n.t(`settings:${page}.name`)}</button
                        >
                    </li>
                {/each}
            </ul>
        </aside>
        <main class="h-[80vh] overflow-auto">
            {#if currentPage == "general"}
                <SettingsGeneral />
            {/if}
            {#if currentPage == "appearance"}
                <SettingsAppearence />
            {/if}
            {#if currentPage == "keybinds"}
                <SettingsKeybinds />
            {/if}
            {#if currentPage == "pins"}
                <h1>todo</h1>
            {/if}
        </main>
    </section>
</Modal>
