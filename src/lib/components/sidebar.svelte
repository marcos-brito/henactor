<script lang="ts">
    import Pin from "$lib/components/pin.svelte";
    import { _ } from "svelte-i18n";
    import Settings from "$lib/components/settings/settings.svelte";
    import Modal from "./modal.svelte";
    import { app } from "$lib/app.svelte";
</script>
<aside id="sidebar" tabindex="-1" bind:this={element}>
    <ul class="menu">
        {#if app.options.title}
            <h1 class="title mb-8 text-3xl">{app.options.title}</h1>
        {/if}
        <li class="menu-title">{$_("pins")}</li>
        {#each app.pins as pin, i}
            <Pin {pin} />
        {/each}
        <li class="menu-title">Tools</li>
        <li><a href="/search">Search</a></li>
        <Modal class="max-w-5xl overflow-hidden">
            {#snippet trigger(dialog: HTMLDialogElement)}
                <li>
                    <button onclick={() => dialog.showModal()}>Settings</button>
                </li>
            {/snippet}
            <Settings />
        </Modal>
    </ul>
</aside>
