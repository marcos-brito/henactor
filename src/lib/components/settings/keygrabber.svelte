<script lang="ts">
    import { configManager } from "$lib";
    import { clickOutside } from "$lib/utils";

    let {
        callback,
    }: {
        callback: (grabbed: string) => void;
    } = $props();

    let grabber: HTMLElement;
    let defaultQuitter = "Control+Enter";
    let quitters = $derived(configManager.config.keybinds.QuitKeyGrabber);
    let grabbed = $state<Array<string>>([]);
    let grabbedStr = $derived(grabbed.join("+"));

    function handleKeyDown(e: KeyboardEvent): void {
        grabbed.push(e.key);
        maybeQuit();
    }

    function maybeQuit() {
        for (const quitter of quitters) {
            if (grabbedStr == quitter) {
                callback("");
                return;
            }
            if (grabbedStr.endsWith(quitter)) {
                callback(grabbedStr.slice(0, grabbedStr.length - quitter.length - 1));
                return;
            }
        }
        if (quitters.length == 0 && grabbedStr == defaultQuitter) {
            callback("");
            return;
        }
        if (quitters.length == 0 && grabbedStr.endsWith(defaultQuitter))
            callback(grabbedStr.slice(0, grabbedStr.length - defaultQuitter.length - 1));
    }

    $effect(() => {
        grabber.focus();
    });
</script>

<button bind:this={grabber} onkeydown={handleKeyDown} use:clickOutside={() => callback("")}>
    {#if quitters.length > 0}
        <p>
            Press your keys. ({configManager.config.keybinds.QuitKeyGrabber[0]} when you are done).
        </p>
    {:else}
        <p>Press your keys. ({defaultQuitter} when you are done).</p>
    {/if}
</button>
