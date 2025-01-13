<script lang="ts">
    import { path as pathApi } from "@tauri-apps/api";
    import { clickOutside } from "$lib/utils";

    let {
        path = $bindable(),
    }: {
        path: string;
    } = $props();

    let editMode = $state(false);
    let ref: HTMLElement;
    let input = $state<HTMLElement>();
    let parts = $derived(path.split(pathApi.sep()).slice(1));

    function buildPathUpTo(idx: number) {
        return pathApi.sep() + parts.slice(0, idx + 1).join(pathApi.sep());
    }

    $effect(() => {
        if (parts) {
            ref.scrollTo(ref.scrollWidth, 0);
        }
    });

    $effect(() => {
        if (input) input.focus();
    });
</script>

<div bind:this={ref} class="breadcrumbs text-sm">
    {#if editMode}
        <input
            bind:this={input}
            use:clickOutside={() => (editMode = false)}
            class="input input-sm input-ghost"
            bind:value={path}
        />
    {:else}
        <ul ondblclick={() => (editMode = true)}>
            <li>
                <button class="btn btn-ghost btn-sm" onclick={() => (path = pathApi.sep())}>
                    {pathApi.sep()}
                </button>
            </li>
            {#each parts as part, i}
                <li>
                    <button class="btn btn-ghost btn-sm" onclick={() => (path = buildPathUpTo(i))}>
                        {part}
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>
