<script lang="ts">
    import { config } from "$lib/config.svelte";
    import Pin from "$lib/components/pin.svelte";
    import { _ } from "svelte-i18n";
</script>
<aside id="sidebar" tabindex="-1" bind:this={element}>
    <ul class="menu">
        {#if config.options.title}
            <h1 class="title mb-8 text-3xl">{config.options.title}</h1>
        {/if}
        <li class="menu-title">{$_("pins")}</li>
        {#each config.pins as pin}
            <Pin {pin} />
        {/each}
    </ul>
</aside>
