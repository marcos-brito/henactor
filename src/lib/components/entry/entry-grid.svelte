<script lang="ts">
    import type { Entry } from "$lib/bindings";
    import EntryIcon from "./entry-icon.svelte";
    import Truncate from "$lib/components/truncate.svelte";

    let { entry, size }: { entry: Entry; size: number } = $props();
</script>

<div class="flex size-full flex-col items-center justify-center gap-2">
    <EntryIcon {size} {entry} />
    <Truncate value={entry.name} />
</div>
