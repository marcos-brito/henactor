<script lang="ts">
    import { configManager } from "$lib";
    import type { Command } from "$lib/bindings";

    let {
        actions,
        trigger,
    }: {
        actions: Partial<Record<Command, () => void>>;
        trigger?: HTMLElement;
    } = $props();

    let holding = $state<Array<String>>([]);
    let fullBinding = $derived(holding.join("+"));

    function handleKeyDown(e: KeyboardEvent): void {
        if (!e.repeat) holding.push(e.key);

        for (const [cmd, keys] of Object.entries(configManager.config.keybinds)) {
            if (keys.includes(fullBinding)) {
                const action = actions[cmd as Command];
                if (action) action();
            }
        }
    }

    function handleKeyUp(): void {
        // filtering makes it buggy and pop makes it wrong. Needs some work.
        holding.pop();
    }

    if (trigger) {
        trigger.addEventListener("keydown", handleKeyDown);
        trigger.addEventListener("keyup", handleKeyUp);
    } else {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    }
</script>
