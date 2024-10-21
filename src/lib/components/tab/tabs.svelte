<script lang="ts">
    import { app } from "$lib/app.svelte";
    import { _ } from "svelte-i18n";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { PlusIcon } from "lucide-svelte";
    import Tab from "./tab.svelte";
    import Navigation from "../navigation.svelte";

    let tabsBar = $state<HTMLElement>();
    let selectables = $state<Array<HTMLElement>>([]);
</script>

{#if tabsBar}
    <Navigation parent={tabsBar} bind:childrens={selectables} orientation="Horizontal" />
{/if}
<nav id="tabs" tabindex="-1" class="navbar" bind:this={tabsBar}>
    <div class="flex flex-col">
        <p class="menu-title self-start">{$_("tabs")}</p>
        <ul class="menu menu-horizontal items-center gap-1 rounded-box">
            {#each app.tabs._ as tabData, id}
                <Tab {tabData} {id} bind:selectable={selectables[id]} />
            {/each}
            <li>
                <button onclick={() => app.tabs.add()} class="btn btn-circle btn-ghost btn-xs">
                    <IconWithFallback iconName="plus" size={16}>
                        <PlusIcon size="16" />
                    </IconWithFallback>
                </button>
            </li>
        </ul>
    </div>
</nav>
