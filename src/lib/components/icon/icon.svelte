<script lang="ts">
    import { app } from "$lib/app.svelte";
    import { path as pathApi } from "@tauri-apps/api";
    import { identifyIcon, resolve, IconType } from "./resolver";

    let {
        icon,
        size,
        basePath,
    }: {
        icon: string;
        size?: number;
        basePath?: string;
    } = $props();

    const iconType = identifyIcon(icon);

    async function buildBasePath() {
        if (app.currentTheme) return app.currentTheme.path;
        return await pathApi.appConfigDir();
    }
</script>

{#await resolve(icon, basePath || (await buildBasePath()), app.options.download_icons) then src}
    {#if iconType == IconType.Text}
        <p style:font-size={`${size || 24}px`}>{src}</p>
    {:else}
        <img {src} style:width={`${size || 24}px`} style:height="auto" alt="icon" />
    {/if}
{/await}
