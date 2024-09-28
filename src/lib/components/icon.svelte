<script lang="ts">
    import { config } from "$lib/config";
    import { IconResolver, IconType, identifyIcon } from "$lib/icon";

    export let icon: string;

    $: iconType = identifyIcon(icon);
    const iconResolver = new IconResolver(icon, $config);
</script>

{#if iconType == IconType.Text}
    <p>{icon}</p>
{:else}
    {#await iconResolver.resolve() then src}
        <img {src} class="size-4" alt="icon" />
    {/await}
{/if}
