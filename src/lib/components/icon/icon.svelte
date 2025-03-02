<script lang="ts">
    import { path as pathApi } from "@tauri-apps/api";
    import { identifyIcon, resolve, IconType } from "./resolver";
    import { configManager } from "$lib";

    let {
        icon,
        size,
    }: {
        icon: string;
        size?: number;
    } = $props();

    const iconType = identifyIcon(icon);

    async function buildBasePath() {
        if (configManager.currentTheme) return await pathApi.join(configManager.currentTheme.path);
        return pathApi.appConfigDir();
    }
</script>

{#await buildBasePath().then( (path) => resolve(icon, path, configManager.config.options.download_icons), ) then src}
    {#if iconType == IconType.Text}
        <p style:font-size={`${size || 24}px`}>{src}</p>
    {:else}
        <img {src} style:width={`${size || 24}px`} style:height="auto" alt="icon" />
    {/if}
{/await}
