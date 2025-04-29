<script lang="ts">
    import { commandRegister, configManager } from "$lib";
    import Keybind from "../keybind.svelte";
    import PalleteBase from "./pallete-base.svelte";
</script>

<PalleteBase
    name="pallete:commands"
    items={Array.from(commandRegister.commands.values())
        .filter((cmd) => cmd.visible)
        .sort((a, b) => a.name.localeCompare(b.name))}
    getFn={(cmd) => cmd.name}
    executor={async (cmd) => {
        if (await cmd.canExecute()) cmd.execute();
    }}
>
    {#snippet children(cmd)}
        <div class="flex gap-2">
            {#each configManager.config.keybinds[cmd.identifier] as keybind}
                <Keybind {keybind} />
            {/each}
        </div>
    {/snippet}
</PalleteBase>
