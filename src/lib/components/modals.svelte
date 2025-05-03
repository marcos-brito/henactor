<script lang="ts">
    import Settings from "$lib/components/settings/settings.svelte";
    import RenameTabModal from "./tab/rename-tab-modal.svelte";
    import { tabsManager } from "$lib";
    import TasksModal from "./tasks/tasks-modal.svelte";
    import * as Pallete from "$lib/components/pallete";
    import * as Search from "$lib/components/search";
    import {
        ActionDelete,
        ActionTrash,
    } from "$lib/components/action";
    import FilterBox from "./filter-box.svelte";
    import { tabsManager } from "$lib";

    let { modalManager }: { modalManager: ModalManager } = $props();
</script>

<Pallete.Commands />
<Pallete.Themes />
<Pallete.View />
<Pallete.Sort />
<Pallete.Goto />
<Pallete.Openers />
<RenameTabModal />
<ActionDelete />
<ActionTrash />
<Search.Deep bind:query={tabsManager.current.query} />
<Search.Quick bind:query={tabsManager.current.filter} />
<TasksModal />
