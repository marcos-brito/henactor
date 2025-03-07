<script lang="ts">
    import type { Tab } from "$lib/bindings";
    import { Menu, Item, Sep } from "$lib/components/context-menu";
    import { i18n, modalManager, tabsManager } from "$lib";

    let { id, tabData }: { id: number; tabData: Tab } = $props();

    let ref = $state<HTMLButtonElement>();
</script>

{#if ref}
    <Menu trigger={ref}>
        <Item onclick={() => tabsManager.add()}>{i18n.t("tab.new", { ns: "contextMenu" })}</Item>
        <Sep />
        <Item onclick={() => tabsManager.close(id)}
            >{i18n.t("tab.close", { ns: "contextMenu" })}</Item
        >
        <Item
            onclick={() =>
                modalManager.show("renameTab", tabData, async (name: string) => {
                    tabsManager.tabs[id].name = name;
                })}>{i18n.t("tab.rename", { ns: "contextMenu" })}</Item
        >
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
    <button
        bind:this={ref}
        onmousedown={(e) => {
            if (e.button == 1) tabsManager.close(id);
        }}
        onclick={() => (tabsManager.currentIdx = id)}
        class:menu-active={id == tabsManager.currentIdx}
        class={"tooltip tooltip-bottom"}
        data-tip={tabData.path}>{tabData.name}</button
    >
</li>
