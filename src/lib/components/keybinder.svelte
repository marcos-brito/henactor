<script lang="ts">
    import type { Command } from "$lib/bindings";
    import { app } from "$lib/app.svelte";

    let {
        actions,
        element,
    }: {
        actions: Partial<Record<Command, () => void>>;
        element: HTMLElement;
    } = $props();

    let holding = $state<Array<String>>([]);
    let fullBinding = $derived(holding.join("+"));

    function handleKeyDown(e: KeyboardEvent): void {
        holding.push(e.key);

        for (const [cmd, keys] of Object.entries(app.keybinds)) {
            if (keys.includes(fullBinding)) {
                const action = actions[cmd as Command];
                if (action) action();
            }
        }
    }

    function handleKeyUp(e: KeyboardEvent): void {
        holding = holding.filter((key) => key != e.key);
    }

    $effect(() => {
        element.addEventListener("keydown", handleKeyDown);
        element.addEventListener("keyup", handleKeyUp);
        }
    });
    element.addEventListener("keydown", handleKeyDown);
    element.addEventListener("keyup", handleKeyUp);

    if (windowActions) {
        window.addEventListener("keydown", handleWidowKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    }
</script>
