<script lang="ts">
    import type { StatusProvider } from "$lib/services/status_registry.svelte";

    let { providers }: { providers: Array<StatusProvider> } = $props();
</script>

<div class="border-t-base-200 mb-4 flex items-center gap-2 border-t p-2 text-xs">
    {#each providers.filter((provider) => provider.status != "") as provider}
        {#if provider.onClick}
            <button
                onclick={() => {
                    provider.onClick!();
                }}
                class="btn btn-ghost btn-xs"
            >
                {provider.status}
            </button>
        {:else}
            <p>{provider.status}</p>
        {/if}
    {/each}
</div>
