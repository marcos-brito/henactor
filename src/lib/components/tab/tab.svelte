<script lang="ts">
    import type { Tab } from "$lib/bindings";
    import { clickOutside } from "$lib/utils";
    import { Menu, Item, Sep } from "$lib/components/context-menu";
    import Keybinder from "../keybinder.svelte";
    import { _ } from "svelte-i18n";
    import { tabsManager } from "$lib";

    let {
        id,
        tabData,
        ref = $bindable(),
    }: { id: number; tabData: Tab; ref: HTMLElement } = $props();

    let editMode = $state(false);
    let input = $state<HTMLElement>();

    $effect(() => {
        if (input) input.focus();
    });
</script>

{#if ref}
    <Menu trigger={ref}>
        <Item onclick={() => tabsManager.add()}>{$_("tab.new")}</Item>
        <Sep />
        <Item onclick={() => tabsManager.close(id)}>{$_("tab.close")}</Item>
        <Item onclick={() => (editMode = true)}>{$_("tab.rename")}</Item>
        <Item onclick={() => tabsManager.duplicate(id)}>{$_("tab.duplicate")}</Item>
        <Sep />
        <Item onclick={() => tabsManager.closeAhead(id)}>{$_("tab.close_ahead")}</Item>
        <Item onclick={() => tabsManager.closeBehind(id)}>{$_("tab.close_behind")}</Item>
        <Item onclick={() => tabsManager.closeAllExcept(id)}>{$_("tab.close_except")}</Item>
    </Menu>
    <Keybinder
        trigger={ref}
        actions={{
            Create: () => tabsManager.add(),
            Delete: () => tabsManager.close(id),
            Rename: () => (editMode = true),
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
            bind:this={ref}
            onmousedown={(e) => {
                if (e.button == 1) tabsManager.close(id);
            }}
            ondblclick={() => (editMode = true)}
            onclick={() => (tabsManager.currentIdx = id)}
            class:active={id == tabsManager.currentIdx}
            class={"tooltip tooltip-bottom"}
            data-tip={tabData.path}>{tabData.name}</button
        >
    {/if}
</li>
