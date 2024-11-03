<script lang="ts">
    import Pin from "$lib/components/pin.svelte";
    import { _ } from "svelte-i18n";
    import Settings from "$lib/components/settings/settings.svelte";
    import Modal from "./modal.svelte";
    import { app } from "$lib/app.svelte";
    import Navigation from "$lib/components/navigation/navigation.svelte";
    import Keybinder from "./keybinder.svelte";

    let childsRef = $state<Array<HTMLElement>>([]);
    let ref = $state<HTMLElement>();
</script>

{#if ref}
    <Navigation parent={ref} childrens={childsRef} orientation="Vertical" />
    <Keybinder
        actions={{
            FocusSidebar: () => {
                if (ref) ref.focus();
            },
        }}
    />
{/if}
<aside bind:this={ref} id="sidebar" tabindex="-1">
    <ul class="menu">
        {#if app.options.title}
            <h1 class="title mb-8 text-3xl">{app.options.title}</h1>
        {/if}
        <li class="menu-title">{$_("pins")}</li>
        {#each app.pins as pin, i}
            <Pin {pin} bind:ref={childsRef[i]} />
        {/each}
        <li class="menu-title">Tools</li>
        <li><a href="/search">Search</a></li>
        <Modal class="max-w-5xl overflow-hidden">
            {#snippet trigger(dialog: HTMLDialogElement)}
                <Keybinder actions={{ OpenConfig: () => dialog.showModal() }} />
                <li>
                    <button
                        bind:this={childsRef[app.pins.length]}
                        onclick={() => dialog.showModal()}>Settings</button
                    >
                </li>
            {/snippet}
            <Settings />
        </Modal>
    </ul>
</aside>
