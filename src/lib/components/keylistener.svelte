<script lang="ts">
    import { container } from "$lib";
    import { CommandRegister } from "$lib/services";

    let holding = $state<Array<String>>([]);

    async function maybeExecute(e: KeyboardEvent): Promise<void> {
        if (!e.repeat) holding.push(e.key);
        const commands = container.get(CommandRegister).find(holding.join("+"));
        for (const command of commands)
            if ((await command.canTrigger()) && (await command.canExecute())) {
                e.preventDefault();
                return await command.execute();
            }
    }

    function clearLastKey(): void {
        holding.pop();
    }

    window.addEventListener("keydown", maybeExecute);
    window.addEventListener("keyup", clearLastKey);
</script>
