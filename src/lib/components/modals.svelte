<script lang="ts">
    import type { Register } from "$lib/commands";
    import type { ModalManager } from "$lib/modal_manager";
    import Settings from "./settings/settings.svelte";
    import { PalleteThemes, PalleteCommands } from "$lib/components/pallete";
    let { register, modalManager }: { register: Register; modalManager: ModalManager } = $props();
</script>

<PalleteCommands />
<PalleteThemes />
<Settings {modalManager} />
