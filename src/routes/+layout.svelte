<script lang="ts">
    import "../app.css";
    import { convertFileSrc } from "@tauri-apps/api/core";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { type Snippet } from "svelte";
    import Tabs from "$lib/components/tab/tabs.svelte";
    import { Toaster, toast } from "svelte-sonner";
    import { commandRegister, configManager, modalManager } from "$lib";
    import Modals from "$lib/components/modals.svelte";
    import Keylistener from "$lib/components/keylistener.svelte";

    let {
        children,
    }: {
        children: Snippet;
    } = $props();

    const currentTheme = $derived(
        configManager.themes.find(
            (theme) => theme.name == configManager.config.options.current_theme,
        ),
    );

    $effect(() => {
        if (currentTheme)
            document.querySelector("html")?.setAttribute("data-theme", currentTheme.name);
    });
</script>

<svelte:head>
    {#if currentTheme}
        <link rel="stylesheet" href={`${convertFileSrc(currentTheme.css_file)}?${Date.now()}`} />
    {/if}
</svelte:head>
<Keylistener />
<Modals {modalManager} />
<Toaster
    position="top-right"
    visibleToasts={1}
    toastOptions={{
        classes: {
            toast: "rounded-sm bg-base-200 border-none",
            title: "font-bold",
            default: "text-base-content",
            info: "text-info",
            error: "text-error",
            warning: "text-warning",
            cancelButton: "!btn",
            actionButton: "!btn",
        },
    }}
/>
<div class="grid grid-cols-[1fr_80vw]">
    <Sidebar />
    <div>
        <Tabs />
        {@render children()}
    </div>
</div>
