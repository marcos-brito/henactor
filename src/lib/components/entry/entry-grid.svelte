<script lang="ts">
    import type { Entry } from "$lib/bindings";
    import EntryIcon from "./entry-icon.svelte";
    import Menu from "./menu.svelte";
    import { open } from "./entry";
    import { trucate } from "$lib/utils";
    import { app } from "$lib/app.svelte";
    import Binds from "./binds.svelte";

    let { entry, ref = $bindable() }: { entry: Entry; ref: HTMLElement } = $props();
</script>

{#if ref}
    <Binds trigger={ref} {entry} />
    <Menu trigger={ref} {entry} />
{/if}
<button
    bind:this={ref}
    ondblclick={async () => await open(entry)}
    class="entry btn btn-ghost flex size-full flex-col items-center justify-center gap-2 p-4 focus:outline"
>
    <EntryIcon {entry} />
    <p class="entry-name">{trucate(entry.name, app.options.truncation_limit)}</p>
</button>
