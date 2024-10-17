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
    let _size = $derived(size || 20);
</script>

{#if iconType == IconType.Text}
    <p class={`text-[${_size}px]`}>{icon}</p>
{:else}
    {#await resolve(icon, iconType) then src}
        <img {src} class={`size-[${_size}px]`} alt="icon" />
    {/await}
{/if}
