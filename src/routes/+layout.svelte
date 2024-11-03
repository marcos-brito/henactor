<script lang="ts">
    import { app, loadingError } from "$lib/app.svelte";
    import "$lib/locale.svelte";
    import "../app.css";
    import { convertFileSrc } from "@tauri-apps/api/core";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { locale } from "$lib/locale.svelte";
    import { type Snippet } from "svelte";
    import Tabs from "$lib/components/tab/tabs.svelte";
    import { Toaster, toast } from "svelte-sonner";
    import { _ } from "svelte-i18n";

    let {
        children,
    }: {
        children: Snippet;
    } = $props();

    $effect(() => {
        if (loadingError) {
            toast.error($_("messages.error.load_config.title"), {
                description: $_("messages.error.load_config.desc"),
            });
        }
    });

    $effect(() => {
        locale.current = app.options.lang;
        app.options.auto_reload ? app.watch() : app.unwatch();
        if (app.tabs._.length == 0) app.tabs.add();
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
<Toaster
    position="top-right"
    visibleToasts={1}
    toastOptions={{
        classes: {
            toast: "rounded bg-base-200 border-none",
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
