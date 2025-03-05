<script lang="ts">
    import { XIcon } from "lucide-svelte";
    import IconWithFallback from "./icon/icon-with-fallback.svelte";
    import type { Snippet } from "svelte";
    import type { Hook, ModalManager } from "$lib/modal_manager";

    let {
        children,
        name,
        params = $bindable(),
        hook = $bindable(),
        onSubmit,
        open = $bindable(false),
        modalManager,
        ...props
    }: {
        children: Snippet;
        name: string;
        params?: any;
        hook?: Hook<any>;
        onSubmit?: () => void;
        open?: boolean;
        modalManager: ModalManager;
        [key: string]: any;
    } = $props();

    modalManager.register({
        name: name,
        show: (p, h) => {
            params = p;
            hook = h;
            open = true;
        },
    });

    let dialog = $state<HTMLDialogElement>();

    $effect(() => {
        dialog?.addEventListener("close", () => (open = false));
    });

    $effect(() => {
        if (dialog) open ? dialog.showModal() : dialog.close();
    });
</script>

<dialog class="modal" bind:this={dialog}>
    <div class={`modal-box p-8 ${props.class}`}>
        <form
            onsubmit={() => {
                open = false;
                if (onSubmit) onSubmit();
            }}
        >
            {@render children()}
        </form>
        <form method="dialog">
            <button class="btn btn-circle btn-ghost btn-sm absolute top-2 right-2">
                <IconWithFallback iconName="x">
                    <XIcon size="20" />
                </IconWithFallback>
            </button>
        </form>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
