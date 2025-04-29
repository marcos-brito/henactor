<script lang="ts">
    import { configManager, container } from "$lib";
    import { CommandRegister } from "$lib/services/command";
    import Keybind from "../keybind.svelte";
    import PalleteBase from "./pallete-base.svelte";
</script>

<PalleteBase
    name="pallete:commands"
    items={Array.from(container.get(CommandRegister).commands.values())
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
