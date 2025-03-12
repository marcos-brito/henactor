<script lang="ts">
    import { i18n } from "$lib";
    import Modal from "../modal.svelte";
    import type { ModalManager } from "$lib/services";
    import { PageGeneral, PageAppearence, PageKeybinds, PageOpeners } from "./page";

    let { modalManager }: { modalManager: ModalManager } = $props();

    const pages = ["general", "appearance", "pins", "keybinds", "openers"] as const;
    let currentPage: (typeof pages)[number] = $state("general");
</script>

<Modal name="settings" {modalManager} class="max-w-5xl">
    <section class="mt-4 grid grid-cols-[150px_1fr]">
        <aside class="h-full overflow-auto">
            <ul class="menu">
                {#each pages as page}
                    <li>
                        <button
                            class:menu-active={page == currentPage}
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
                <PageGeneral />
            {/if}
            {#if currentPage == "appearance"}
                <PageAppearence />
            {/if}
            {#if currentPage == "keybinds"}
                <PageKeybinds />
            {/if}
            {#if currentPage == "pins"}
                <h1>todo</h1>
            {/if}
            {#if currentPage == "openers"}
                <PageOpeners />
            {/if}
        </main>
    </section>
</Modal>
