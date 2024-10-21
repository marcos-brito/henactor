<script lang="ts">
    import { app } from "$lib/app.svelte";
    import type { Icons } from "$lib/bindings";
    import type { Snippet } from "svelte";
    import { identifyIcon, resolve, IconType } from "./icon";

    let {
        iconName,
        size,
        children,
    }: {
        iconName: keyof Icons;
        size?: number;
        children: Snippet;
    } = $props();

    let icon = $derived.by(() => {
        if (app.currentTheme && app.currentTheme.icons) {
            return app.currentTheme.icons[iconName];
        }
    });
</script>

{#if icon}
    {#if identifyIcon(icon) == IconType.Text}
        <p class={`text-[${size || 20}px]`}>{icon}</p>
    {:else}
        {#await resolve(icon, identifyIcon(icon), app.currentTheme!.name) then src}
            <img {src} class={`size-[${size || 20}px]`} alt="icon" />
        {/await}
    {/if}
{:else}
    {@render children()}
{/if}
