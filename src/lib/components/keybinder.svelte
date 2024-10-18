<script lang="ts">
    import type { Command } from "$lib/bindings";
    import { config } from "$lib/config.svelte";

    let {
        actions,
        element,
    }: {
        element: HTMLElement;
        actions: Partial<Record<Command, () => void>>;
    } = $props();

    let holding = $state<Array<String>>([]);
    let fullBinding = $derived(holding.join("+"));
    $inspect(element);

    function handleKeyDown(e: KeyboardEvent): void {
        holding.push(e.key);

        for (const [cmd, keys] of Object.entries(config.options.keybindings)) {
            if (keys.includes(fullBinding) && actions) {
                const action = actions[cmd as Command];
                if (action) action();
            }
        }
    }

    function handleKeyUp(e: KeyboardEvent): void {
        holding = holding.filter((key) => key != e.key);
    }

    $effect(() => {
        if (element) {
            element.addEventListener("keydown", handleKeyDown);
            element.addEventListener("keyup", handleKeyUp);
        }
    });
</script>
