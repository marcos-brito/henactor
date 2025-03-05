<script lang="ts">
    import { commandRegister } from "$lib";

    let holding = $state<Array<String>>([]);

    async function maybeExecute(e: KeyboardEvent): Promise<void> {
        if (!e.repeat) holding.push(e.key);
        const command = commandRegister.find(holding.join("+"));
        if (command && (await command.canExecute())) await command.execute();
    }

    function clearLastKey(): void {
        holding.pop();
    }

    window.addEventListener("keydown", maybeExecute);
    window.addEventListener("keyup", clearLastKey);
</script>
