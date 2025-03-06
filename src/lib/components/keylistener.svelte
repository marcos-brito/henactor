<script lang="ts">
    import { commandRegister } from "$lib";

    let holding = $state<Array<String>>([]);

    async function maybeExecute(e: KeyboardEvent): Promise<void> {
        if (!e.repeat) holding.push(e.key);
        const commands = commandRegister.find(holding.join("+"));
        for (const command of commands)
            if (await command.canExecute()) return await command.execute();
    }

    function clearLastKey(): void {
        holding.pop();
    }

    window.addEventListener("keydown", maybeExecute);
    window.addEventListener("keyup", clearLastKey);
</script>
