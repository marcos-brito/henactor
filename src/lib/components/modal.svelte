<script lang="ts">
    import { XIcon } from "lucide-svelte";
    import IconWithFallback from "./icon/icon-with-fallback.svelte";
    import type { Snippet } from "svelte";

    let {
        children,
        trigger,
        ...props
    }: {
        trigger: Snippet<[HTMLDialogElement]>;
        children: Snippet;
        [key: string]: any;
    } = $props();

    let dialog = $state<HTMLDialogElement>();
</script>

{#if dialog}
    {@render trigger(dialog)}
{/if}
<dialog class="modal" bind:this={dialog}>
    <div class={`modal-box p-8 ${props.class}`}>
        <form method="dialog">
            <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                <IconWithFallback iconName="x">
                    <XIcon size="20" />
                </IconWithFallback>
            </button>
        </form>
        {@render children()}
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
