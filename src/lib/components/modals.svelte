<script lang="ts">
    import type { ModalManager } from "$lib/services";
    import Settings from "$lib/components/settings/settings.svelte";
    import RenameTabModal from "./tab/rename-tab-modal.svelte";
    import {
        PalleteThemes,
        PalleteCommands,
        PalleteView,
        PalleteSort,
        PalleteGoto,
        PalleteOpeners,
    } from "$lib/components/pallete";
    import {
        ActionDelete,
        ActionTrash,
    } from "$lib/components/action";
    import FilterBox from "./filter-box.svelte";
    import { tabsManager } from "$lib";

    let { modalManager }: { modalManager: ModalManager } = $props();
</script>

<PalleteCommands />
<PalleteThemes />
<PalleteView />
<PalleteSort />
<PalleteGoto />
<PalleteOpeners />
<Settings {modalManager} />
<RenameTabModal />
<ActionDelete />
<ActionTrash />
<FilterBox bind:filter={tabsManager.current.filter} />
