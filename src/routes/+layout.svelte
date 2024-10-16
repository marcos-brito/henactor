<script lang="ts">
    import "$lib/locale.svelte";
    import "../app.css";
    import { config } from "$lib/config.svelte";
    import { convertFileSrc } from "@tauri-apps/api/core";
    import { waitLocale } from "svelte-i18n";
    import { locale } from "$lib/locale.svelte";
    import type { Snippet } from "svelte";
    let {
        children,
    }: {
        children: Snippet;
    } = $props();

    $effect(() => {
        waitLocale();
        locale.current = config.options.lang;
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
