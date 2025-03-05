<script lang="ts">
    import { commandRegister } from "$lib";

    let holding = $state<Array<String>>([]);

    async function handleKeyDown(e: KeyboardEvent): Promise<void> {
        if (!e.repeat) holding.push(e.key);
        const command = commandRegister.find(holding.join("+"));
        if (command && (await command.canExecute())) await command.execute();
    }

    function handleKeyUp(): void {
        // filtering makes it buggy and pop makes it wrong. Needs some work.
        holding.pop();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
</script>
