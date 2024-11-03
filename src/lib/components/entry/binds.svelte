<script lang="ts">
    import { type Command, type Entry } from "$lib/bindings";
    import { _ } from "svelte-i18n";
    import Keybinder from "$lib/components/keybinder.svelte";
    import { gotoParent, open } from "./entry";

    let {
        trigger,
        entry,
        actions,
    }: { trigger: HTMLElement; entry: Entry; actions?: Partial<Record<Command, () => void>> } =
        $props();
</script>

<Keybinder
    {trigger}
    actions={{
        Open: () => {
            open(entry);
        },
        GotoParent: () => {
            gotoParent(entry);
        },
        ...actions,
    }}
/>
