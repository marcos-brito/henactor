<script lang="ts">
    import "$lib/locale.svelte";
    import "../app.css";
    import { config } from "$lib/config.svelte";
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
    });
</script>

