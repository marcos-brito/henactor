<script lang="ts">
    import type { Tab } from "$lib/bindings";
    import * as ContextMenu from "$lib/components/context-menu";
    import { i18n, modalManager, tabsManager } from "$lib";

    let { id, tabData }: { id: number; tabData: Tab } = $props();

    let ref = $state<HTMLButtonElement>();
</script>

<ContextMenu.Root>
    {#snippet trigger(showMenu)}
        <li class="flex gap-2">
            <button
                bind:this={ref}
                onmousedown={(e) => {
                    if (e.button == 1) tabsManager.close(id);
                }}
                onclick={() => (tabsManager.currentIdx = id)}
                oncontextmenu={showMenu}
                class:menu-active={id == tabsManager.currentIdx}
                class={"tooltip tooltip-bottom"}
                data-tip={tabData.path}
                >{tabData.name}
            </button>
        </li>
    {/snippet}
    {#snippet items()}
        <ContextMenu.Item onclick={() => tabsManager.add()}
            >{i18n.t("tab.new", { ns: "contextMenu" })}</ContextMenu.Item
        >
        <ContextMenu.Sep />
        <ContextMenu.Item onclick={() => tabsManager.close(id)}
            >{i18n.t("tab.close", { ns: "contextMenu" })}</ContextMenu.Item
        >
        <ContextMenu.Item
            onclick={() =>
                modalManager.show("renameTab", tabData, async (name: string) => {
                    tabsManager.tabs[id].name = name;
                })}>{i18n.t("tab.rename", { ns: "contextMenu" })}</ContextMenu.Item
        >
        <ContextMenu.Item onclick={() => tabsManager.duplicate(id)}
            >{i18n.t("tab.duplicate", { ns: "contextMenu" })}</ContextMenu.Item
        >
        <ContextMenu.Sep />
        <ContextMenu.Item onclick={() => tabsManager.closeAhead(id)}
            >{i18n.t("tab.closeAhead", { ns: "contextMenu" })}</ContextMenu.Item
        >
        <ContextMenu.Item onclick={() => tabsManager.closeBehind(id)}
            >{i18n.t("tab.closeBehind", { ns: "contextMenu" })}</ContextMenu.Item
        >
        <ContextMenu.Item onclick={() => tabsManager.closeAllExcept(id)}
            >{i18n.t("tab.closeExcept", { ns: "contextMenu" })}</ContextMenu.Item
        >
    {/snippet}
</ContextMenu.Root>
