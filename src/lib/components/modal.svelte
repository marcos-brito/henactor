<script lang="ts">
    import { XIcon } from "lucide-svelte";
    import IconWithFallback from "./icon/icon-with-fallback.svelte";
    import type { Snippet } from "svelte";
    import { type Hook } from "$lib/services/modal_manager";
    import { modalManager } from "$lib";

    let {
        children,
        name,
        params = $bindable(),
        hook = $bindable(),
        onSubmit,
        open = $bindable(false),
        ...props
    }: {
        children: Snippet;
        name: string;
        params?: any;
        hook?: Hook<any>;
        onSubmit?: () => void;
        open?: boolean;
        [key: string]: any;
    } = $props();

    modalManager.register({
        name: name,
        show: (p, h) => {
            params = p;
            hook = h;
            open = true;
        },
        hide: () => {
            open = false;
        },
    });

    let dialog: HTMLDialogElement;

    $effect(() => {
        dialog?.addEventListener("close", () => {
            modalManager.hide(name);
        });
    });

    $effect(() => {
        if (dialog) open ? dialog.showModal() : dialog.close();
    });
</script>

<dialog class="modal" bind:this={dialog}>
    <div class={`modal-box p-8 ${props.class}`}>
        <form
            method="dialog"
            class="h-full w-full"
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
