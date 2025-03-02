<script lang="ts">
    import type { Entry } from "$lib/bindings";
    import EntryIcon from "./entry-icon.svelte";
    import EntryActions from "./entry-actions.svelte";
    import { open } from "./entry-actions.svelte";
    import { trucate } from "$lib/utils";
    import { configManager } from "$lib";

    let { entry, ref = $bindable() }: { entry: Entry; ref: HTMLElement } = $props();
</script>

{#if ref}
    <EntryActions trigger={ref} {entry} />
{/if}
<button
    bind:this={ref}
    ondblclick={async () => await open(entry)}
    class="entry btn btn-ghost flex size-full flex-col items-center justify-center gap-2 p-4 focus:outline"
>
    <EntryIcon {entry} />
    <p class="entry-name">{trucate(entry.name, configManager.config.options.truncation_limit)}</p>
</button>
