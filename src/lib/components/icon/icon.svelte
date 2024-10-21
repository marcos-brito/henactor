<script lang="ts">
    import { identifyIcon, resolve, IconType } from "./icon";

    let {
        icon,
        size,
    }: {
        icon: string;
        size?: number;
    } = $props();

    const iconType = identifyIcon(icon);
</script>

{#if iconType == IconType.Text}
    <p class={`text-[${size || 20}px]`}>{icon}</p>
{:else}
    {#await resolve(icon, iconType) then src}
        <img {src} class={`size-[${size || 20}px]`} alt="icon" />
    {/await}
{/if}
