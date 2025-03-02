<script lang="ts">
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { PlusIcon } from "lucide-svelte";
    import Tab from "./tab.svelte";
    import Navigation from "$lib/components/navigation/navigation.svelte";
    import Keybinder from "$lib/components/keybinder.svelte";
    import { i18n, tabsManager } from "$lib";

    let ref = $state<HTMLElement>();
    let childsRef = $state<Array<HTMLElement>>([]);
</script>

{#if ref}
    <Navigation parent={ref} childrens={childsRef} orientation="Horizontal" />
    <Keybinder
        actions={{
            FocusTabs: () => {
                if (ref) ref.focus();
            },
            NewTab: () => {
                tabsManager.add();
            },
            CloseTab: () => {
                tabsManager.close(tabsManager.currentIdx);
            },
            NextTab: () => {
                tabsManager.next();
            },
            PreviousTab: () => {
                tabsManager.previous();
            },
        }}
    />
{/if}
<nav id="tabs" tabindex="-1" class="navbar p-0" bind:this={ref}>
    <div class="flex flex-col">
        <p class="menu-title self-start">{i18n.t("words.tabs", { ns: "ui" })}</p>
        <ul class="menu menu-horizontal items-center gap-1 rounded-box">
            {#each tabsManager.tabs as tabData, id}
                <Tab {tabData} {id} bind:ref={childsRef[id]} />
            {/each}
            <li>
                <button
                    bind:this={childsRef[tabsManager.tabs.length]}
                    onclick={() => tabsManager.add()}
                    class="btn btn-circle btn-ghost btn-xs"
                >
                    <IconWithFallback iconName="plus" size={16}>
                        <PlusIcon size="16" />
                    </IconWithFallback>
                </button>
            </li>
        </ul>
    </div>
</nav>
