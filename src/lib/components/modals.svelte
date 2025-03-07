<script lang="ts">
    import type { Register } from "$lib/commands";
    import type { ModalManager } from "$lib/services";
    import Settings from "$lib/components/settings/settings.svelte";
    import { PalleteThemes, PalleteCommands } from "$lib/components/pallete";
    import PalleteView from "./pallete/pallete-view.svelte";
    import PalleteSort from "./pallete/pallete-sort.svelte";
    let { register, modalManager }: { register: Register; modalManager: ModalManager } = $props();
</script>

<PalleteCommands />
<PalleteThemes />
<PalleteView />
<PalleteSort />
<Settings {modalManager} />
