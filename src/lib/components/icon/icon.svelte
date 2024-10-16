<script lang="ts">
    import { identifyIcon, resolve, IconType } from "./icon";

    let {
        icon,
        ...props
    }: {
        icon: string;
        [key: string]: any;
    } = $props();

    const iconType = identifyIcon(icon);
</script>

{#if iconType == IconType.Text}
    <p {...props}>{icon}</p>
{:else}
    {#await resolve(icon, iconType) then src}
        <img {src} {...props} alt="icon" />
    {/await}
{/if}
