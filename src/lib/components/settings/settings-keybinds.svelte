<script lang="ts">
    import { commandRegister, configManager } from "$lib";
    import SettingsCmd from "./settings-cmd.svelte";

    const commands = $derived(Array.from(commandRegister.commands.values()));
</script>

{#each commands as cmd}
    <SettingsCmd {cmd} bind:value={configManager.config.keybinds[cmd.identifier]} />
    <div class="divider my-0"></div>
{/each}
