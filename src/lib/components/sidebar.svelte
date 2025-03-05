<script lang="ts">
    import Pin from "$lib/components/pin.svelte";
    import { configManager, i18n, modalManager } from "$lib";
</script>

<aside id="sidebar" tabindex="-1">
    <ul class="menu">
        {#if configManager.config.options.title}
            <h1 class="title mb-8 text-3xl">{configManager.config.options.title}</h1>
        {/if}
        <li class="menu-title">{i18n.t("words.pins", { ns: "ui" })}</li>
        {#each configManager.config.pins as pin}
            <Pin {pin} />
        {/each}
        <li class="menu-title">Tools</li>
        <li><a href="/search">Search</a></li>
        <li>
            <button onclick={() => modalManager.show("settings")}>Settings</button>
        </li>
    </ul>
</aside>
