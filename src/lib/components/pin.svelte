<script lang="ts">
    import { type Pin } from "$lib/bindings";
    import Icon from "$lib/components/icon/icon.svelte";

    let { pin }: { pin: Pin } = $props();
</script>

<li>
    <a href={`${pin.target}`}>
        {#if pin.icon}
            <Icon icon={pin.icon} size={40} />
        {/if}
        {pin.alias}
    </a>
</li>
