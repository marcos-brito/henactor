<script lang="ts">
    import Pin from "$lib/components/pin.svelte";
    import Settings from "$lib/components/settings/settings.svelte";
    import Modal from "./modal.svelte";
    import Navigation from "$lib/components/navigation/navigation.svelte";
    import Keybinder from "./keybinder.svelte";
    import { configManager, i18n, modalManager } from "$lib";

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
        {#if configManager.config.options.title}
            <h1 class="title mb-8 text-3xl">{configManager.config.options.title}</h1>
        {/if}
        <li class="menu-title">{i18n.t("words.pins", { ns: "ui" })}</li>
        {#each configManager.config.pins as pin, i}
            <Pin {pin} bind:ref={childsRef[i]} />
        {/each}
        <li class="menu-title">Tools</li>
        <li><a href="/search">Search</a></li>
        <li>
            <button onclick={() => modalManager.show("settings")}>Settings</button>
        </li>
    </ul>
</aside>
