<script lang="ts">
    import { app } from "$lib/app.svelte";
    import { type Pin } from "$lib/bindings";
    import Icon from "$lib/components/icon/icon.svelte";

    let { pin, ref = $bindable() }: { pin: Pin; ref: HTMLElement } = $props();
</script>

<li>
    <button class="pin" onclick={() => app.tabs.setCurrentPath(pin.target)} bind:this={ref}>
        {#if pin.icon}
            <Icon icon={pin.icon} size={40} />
        {/if}
        {pin.alias}
    </button>
</li>
