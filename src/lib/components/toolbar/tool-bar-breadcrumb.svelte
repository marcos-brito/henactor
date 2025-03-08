<script lang="ts">
    import { path as pathApi } from "@tauri-apps/api";
    import { modalManager } from "$lib";

    let {
        path = $bindable(),
    }: {
        path: string;
    } = $props();

    let ref: HTMLElement;
    let parts = $derived(path.split(pathApi.sep()).slice(1));

    function buildPathUpTo(idx: number) {
        return pathApi.sep() + parts.slice(0, idx + 1).join(pathApi.sep());
    }

    $effect(() => {
        if (parts) {
            ref.scrollTo(ref.scrollWidth, 0);
        }
    });
</script>

<div bind:this={ref} class="breadcrumbs text-sm">
    <ul ondblclick={() => modalManager.show("pallete:goto")}>
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
</div>
