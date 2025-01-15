<script lang="ts">
    import { app } from "$lib/app.svelte";
    import type { Icons } from "$lib/bindings";
    import type { Snippet } from "svelte";
    import Icon from "./icon.svelte";

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
        if (app.currentTheme?.icons?.ui) {
            return app.currentTheme.icons.ui[iconName];
        }
    });
</script>

{#if icon}
    <Icon {icon} {size} />
{:else}
    {@render children()}
{/if}
