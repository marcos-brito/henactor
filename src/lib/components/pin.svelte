<script lang="ts">
    import { type Pin } from "$lib/bindings";
    import Icon from "$lib/components/icon/icon.svelte";
    import { tabsManager } from "$lib";

    let { pin, ref = $bindable() }: { pin: Pin; ref: HTMLElement } = $props();
</script>

<li>
    <button class="pin" onclick={() => tabsManager.setCurrentPath(pin.target)} bind:this={ref}>
        {#if pin.icon}
            <Icon icon={pin.icon} size={16} />
        {/if}
        {pin.alias}
    </button>
</li>
