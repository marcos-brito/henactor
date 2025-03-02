<script lang="ts">
    import type { Icons } from "$lib/bindings";
    import type { Snippet } from "svelte";
    import Icon from "./icon.svelte";
    import { configManager } from "$lib";

    let {
        iconName,
        size,
        children,
    }: {
        iconName: keyof Icons;
        size?: number;
        children: Snippet;
    } = $props();

    const currentTheme = configManager.themes.find(
        (t) => t.name == configManager.config.options.current_theme,
    );
    const icon = $derived.by(() => {
        if (currentTheme?.icons?.ui) {
            return currentTheme.icons.ui[iconName];
        }
    });
</script>

{#if icon}
    <Icon {icon} {size} />
{:else}
    {@render children()}
{/if}
