<script lang="ts">
    import { configManager } from "$lib";
    import { trucate } from "$lib/utils";

    let {
        value,
        limit = configManager.config.options.truncation_limit,
        tag = "p",
        ...props
    }: { value: string; limit?: number; tag?: string; [key: string]: any } = $props();
</script>

<svelte:element this={tag} {...props}>{trucate(value, limit)}</svelte:element>
