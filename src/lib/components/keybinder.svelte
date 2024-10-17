<script lang="ts">
    import type { Snippet } from "svelte";
    import type { Command } from "$lib/bindings";
    import { config } from "$lib/config.svelte";

    let {
        actions,
        container = $bindable(),
        children,
    }: {
        actions?: Partial<Record<Command, () => void>>;
        container?: HTMLElement;
        children: Snippet;
    } = $props();

    let holding = $state<Array<String>>([]);
    let fullBinding = $derived(holding.join("+"));

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
</script>

<div bind:this={container} tabindex="-1" onkeyup={handleKeyUp} onkeydown={handleKeyDown}>
    {@render children()}
</div>
