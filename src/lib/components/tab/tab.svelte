<script lang="ts">
    import type { Tab } from "$lib/bindings";
    import { clickOutside } from "$lib/utils";
    import { Menu, Item, Sep } from "$lib/components/context-menu";
    import { i18n, tabsManager } from "$lib";

    let { id, tabData }: { id: number; tabData: Tab } = $props();

    let editMode = $state(false);
    let input = $state<HTMLElement>();
    let ref = $state<HTMLButtonElement>();

    $effect(() => {
        if (input) input.focus();
    });
</script>

{#if ref}
    <Menu trigger={ref}>
        <Item onclick={() => tabsManager.add()}>{i18n.t("tab.new", { ns: "contextMenu" })}</Item>
        <Sep />
        <Item onclick={() => tabsManager.close(id)}
            >{i18n.t("tab.close", { ns: "contextMenu" })}</Item
        >
        <Item onclick={() => (editMode = true)}>{i18n.t("tab.rename", { ns: "contextMenu" })}</Item>
        <Item onclick={() => tabsManager.duplicate(id)}
            >{i18n.t("tab.duplicate", { ns: "contextMenu" })}</Item
        >
        <Sep />
        <Item onclick={() => tabsManager.closeAhead(id)}
            >{i18n.t("tab.closeAhead", { ns: "contextMenu" })}</Item
        >
        <Item onclick={() => tabsManager.closeBehind(id)}
            >{i18n.t("tab.closeBehind", { ns: "contextMenu" })}</Item
        >
        <Item onclick={() => tabsManager.closeAllExcept(id)}
            >{i18n.t("tab.closeExcept", { ns: "contextMenu" })}</Item
        >
    </Menu>
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
