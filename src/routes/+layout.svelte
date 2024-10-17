<script lang="ts">
    import "$lib/locale.svelte";
    import "../app.css";
    import { config } from "$lib/config.svelte";
    import { convertFileSrc } from "@tauri-apps/api/core";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { locale } from "$lib/locale.svelte";
    import type { Snippet } from "svelte";
    import { commands } from "$lib/bindings";

    let {
        children,
    }: {
        children: Snippet;
    } = $props();

    $effect(() => {
        locale.current = config.options.lang;
        if (config.options.save_on_change) commands.saveConfig(config.configPath, config.options);
        if (config.currentTheme)
            document.querySelector("html")?.setAttribute("data-theme", config.currentTheme.name);
    });
</script>

<svelte:head>
    {#if config.currentTheme}
        <link
            rel="stylesheet"
            href={`${convertFileSrc(config.currentTheme.css_file)}?${Date.now()}`}
        />
    {/if}
</svelte:head>
<div class="grid grid-cols-[200px_1fr]">
    <Sidebar />
    {@render children()}
</div>

