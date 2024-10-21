<script lang="ts">
    import { app } from "$lib/app.svelte";
    import "$lib/locale.svelte";
    import "../app.css";
    import { convertFileSrc } from "@tauri-apps/api/core";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { locale } from "$lib/locale.svelte";
    import type { Snippet } from "svelte";

    let {
        children,
    }: {
        children: Snippet;
    } = $props();

    $effect(() => {
        locale.current = app.options.lang;
        app.options.auto_reload ? app.watch() : app.unwatch();
        if (app.tabs._.length == 0) app.tabs.add();
        if (app.options.save_on_change) app.save();
        if (app.currentTheme)
            document.querySelector("html")?.setAttribute("data-theme", app.currentTheme.name);
    });
</script>

<svelte:head>
    {#if app.currentTheme}
        <link
            rel="stylesheet"
            href={`${convertFileSrc(app.currentTheme.css_file)}?${Date.now()}`}
        />
    {/if}
</svelte:head>
<div class="grid grid-cols-[200px_1fr]">
    <Sidebar />
    {@render children()}
</div>

