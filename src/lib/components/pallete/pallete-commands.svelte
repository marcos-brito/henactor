<script lang="ts">
    import { commandRegister, configManager } from "$lib";
    import Keybind from "../keybind.svelte";
    import PalleteBase from "./pallete-base.svelte";
</script>

<PalleteBase
    name="pallete:commands"
    items={commandRegister.all()}
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
