<script lang="ts">
    import type { Register } from "$lib/commands";
    import type { ModalManager } from "$lib/modal_manager";
    import Settings from "./settings/settings.svelte";
    let { register, modalManager }: { register: Register; modalManager: ModalManager } = $props();
</script>

<Settings {modalManager} />
