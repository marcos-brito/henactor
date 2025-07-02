<script lang="ts">
    import { i18n } from "$lib";
    import Modal from "$lib/components/modal.svelte";
    import * as Pages from "./pages";

    type Page = keyof typeof pages;

    const pages = {
        general: Pages.General,
        appearence: Pages.Appearence,
        keybinds: Pages.Keybinds,
        openers: Pages.Openers,
    };

    let current: Page = $state("general");
    let CurrentPage = $derived(pages[current]);
</script>

<Modal name="settings" class="max-w-5xl">
    <section class="mt-4 grid grid-cols-[150px_1fr]">
        <aside class="h-full overflow-auto">
            <ul class="menu">
                {#each Object.keys(pages) as page}
                    <li>
                        <button
                            class:menu-active={page == current}
                            type="button"
                            class={page == current ? "active" : ""}
                            onclick={() => (current = page as Page)}
                            >{i18n.t(`settings:${page}.name`)}</button
                        >
                    </li>
                {/each}
            </ul>
        </aside>
        <main class="h-[80vh] overflow-auto">
            <CurrentPage />
        </main>
    </section>
</Modal>
