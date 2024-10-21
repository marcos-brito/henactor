<script lang="ts">
    import type { Tab } from "$lib/bindings";
    import { app } from "$lib/app.svelte";
    import { clickOutside } from "$lib/utils";
    import { Menu, Item, Sep } from "$lib/components/context-menu";
    import Keybinder from "../keybinder.svelte";
    import { _ } from "svelte-i18n";

    let {
        tabData,
        id,
        selectable: button = $bindable(),
    }: { tabData: Tab; id: number; selectable: HTMLElement } = $props();

    let editMode = $state(false);
    let input = $state<HTMLElement>();

    $effect(() => {
        if (input) input.focus();
    });
</script>

{#if button}
    <Menu trigger={button}>
        <Item onclick={() => app.tabs.add()}>{$_("tab.new")}</Item>
        <Sep />
        <Item onclick={() => app.tabs.close(id)}>{$_("tab.close")}</Item>
        <Item onclick={() => (editMode = true)}>{$_("tab.rename")}</Item>
        <Item onclick={() => app.tabs.duplicate(id)}>{$_("tab.duplicate")}</Item>
        <Sep />
        <Item onclick={() => app.tabs.closeAhead(id)}>{$_("tab.close_ahead")}</Item>
        <Item onclick={() => app.tabs.closeBehind(id)}>{$_("tab.close_behind")}</Item>
        <Item onclick={() => app.tabs.closeAllExcept(id)}>{$_("tab.close_except")}</Item>
    </Menu>
    <Keybinder
        element={button}
        actions={{
            Create: () => app.tabs.add(),
            Delete: () => app.tabs.close(id),
            Edit: () => (editMode = true),
        }}
    />
{/if}
<li>
    {#if editMode}
        <input
            bind:this={input}
            use:clickOutside={() => (editMode = false)}
            type="text"
            bind:value={tabData.name}
            class="input input-xs input-ghost text-sm"
        />
    {:else}
        <button
            bind:this={button}
            onmousedown={(e) => {
                if (e.button == 1) app.tabs.close(id);
            }}
            ondblclick={() => (editMode = true)}
            onclick={() => (app.tabs.currentIdx = id)}
            class={`tooltip tooltip-bottom ${id == app.tabs.currentIdx ? "active" : ""}`}
            data-tip={tabData.path}>{tabData.name}</button
        >
    {/if}
</li>
