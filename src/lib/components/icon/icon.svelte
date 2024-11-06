<script lang="ts">
    import { app } from "$lib/app.svelte";
    import { identifyIcon, resolve, IconType } from "./icon";

    let {
        icon,
        size,
        fromCurrentTheme,
    }: {
        icon: string;
        size?: number;
        fromCurrentTheme?: boolean;
    } = $props();

    const iconType = identifyIcon(icon);
</script>

{#await resolve(icon, iconType, fromCurrentTheme && app.currentTheme ? app.currentTheme.name : undefined) then src}
    {#if iconType == IconType.Text}
        <p style:font-size={`${size || 24}px`}>{src}</p>
    {:else}
        <img {src} style:width={`${size || 24}px`} style:height="auto" alt="icon" />
    {/if}
{/await}
