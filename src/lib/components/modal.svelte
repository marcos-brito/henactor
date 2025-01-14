<script lang="ts">
    import { XIcon } from "lucide-svelte";
    import IconWithFallback from "./icon/icon-with-fallback.svelte";
    import type { Snippet } from "svelte";

    let {
        children,
        open = $bindable(),
        trigger,
        ...props
    }: {
        trigger?: Snippet<[HTMLDialogElement]>;
        children: Snippet;
        [key: string]: any;
    } = $props();

    let dialog = $state<HTMLDialogElement>();

    $effect(() => {
        if (dialog) open ? dialog.showModal() : dialog.close();
    });
</script>

{#if dialog && trigger}
    {@render trigger(dialog)}
{/if}
<dialog class="modal" bind:this={dialog}>
    <div class={`modal-box p-8 ${props.class}`}>
        {@render children()}
        <form method="dialog">
            <button
                onclick={() => (open = false)}
                class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            >
                <IconWithFallback iconName="x">
                    <XIcon size="20" />
                </IconWithFallback>
            </button>
        </form>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button onclick={() => (open = false)}>close</button>
    </form>
</dialog>
