<script lang="ts">
    import { app } from "$lib/app.svelte";
    import { _ } from "svelte-i18n";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { PlusIcon } from "lucide-svelte";
    import Tab from "./tab.svelte";
    import Navigation from "$lib/components/navigation.svelte";
    import Keybinder from "$lib/components/keybinder.svelte";

    let ref = $state<HTMLElement>();
    let childsRef = $state<Array<HTMLElement>>([]);
</script>

{#if ref}
    <Navigation parent={ref} bind:childrens={childsRef} orientation="Horizontal" />
    <Keybinder
        actions={{
            FocusTabs: () => {
                if (ref) ref.focus();
            },
            NewTab: () => {
                app.tabs.add();
            },
            CloseTab: () => {
                app.tabs.close(app.tabs.currentIdx);
            },
            NextTab: () => {
                app.tabs.currentIdx += 1;
            },
            PreviousTab: () => {
                app.tabs.currentIdx -= 1;
            },
        }}
    />
{/if}
<nav id="tabs" tabindex="-1" class="navbar p-0" bind:this={ref}>
    <div class="flex flex-col">
        <p class="menu-title self-start">{$_("tabs")}</p>
        <ul class="menu menu-horizontal items-center gap-1 rounded-box">
            {#each app.tabs._ as tabData, id}
                <Tab {tabData} {id} bind:ref={childsRef[id]} />
            {/each}
            <li>
                <button
                    bind:this={childsRef[app.tabs._.length]}
                    onclick={() => app.tabs.add()}
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
