    import { commands, type Entry as DirEntry, type View } from "$lib/bindings";
    import type { Snippet } from "svelte";
    import { EntryGrid } from "$lib/components/entry";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { BirdIcon } from "lucide-svelte";
    import { _ } from "svelte-i18n";
    import Modal from "$lib/components/modal.svelte";
    import Keybinder from "$lib/components/keybinder.svelte";
    import Navigation from "$lib/components/navigation/navigation.svelte";
    let {
        path = $bindable(),
        view = $bindable(),
        gridSize = $bindable(),
        columns = $bindable(),
        query = $bindable(),
    }: {
        path: string;
        view: View;
        gridSize: number;
        columns: Array<ListColumn>;
        query: string;
    } = $props();

    let ref = $state<HTMLElement>();
    let childsRef = $state<Array<HTMLElement>>([]);
    let views: Record<View, Snippet<[Array<DirEntry>]>> = {
        Grid: gridView,
    };

    $effect(() => {
        if (path) ref?.focus();
    });
</script>

{#snippet gridView(entries: Array<DirEntry>)}
    {#if ref}
        <Navigation
            parent={ref}
            childrens={childsRef}
            orientation="Both"
            numberOfColumns={gridSize}
        />
    {/if}
    <ul tabindex="-1" id="explorer" bind:this={ref} class={`grid grid-cols-4 gap-4`}>
        {#each entries as entry, i}
            <EntryGrid bind:ref={childsRef[i]} {entry} />
        {/each}
    </ul>
{/snippet}
{#if ref}
    <Keybinder
        actions={{
            FocusExplorer: () => {
                if (ref) ref.focus();
            },
        }}
    />
{/if}
{#await commands.list(path) then entries}
    {#if entries.length == 0}
        <div class="flex w-full flex-col justify-center gap-4">
            <IconWithFallback size={160} iconName="empty_dir">
                <BirdIcon strokeWidth={0.5} size={160} />
                <h1 class="text-xl font-bold">{$_("messages.empty_dir")}</h1>
            </IconWithFallback>
        </div>
    {:else}
        {@render views[view](entries)}
    {/if}
{/await}
