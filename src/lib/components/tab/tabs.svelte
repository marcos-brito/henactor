<script lang="ts">
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { PlusIcon } from "lucide-svelte";
    import Tab from "./tab.svelte";
    import { i18n, tabsManager } from "$lib";
</script>

<nav class="navbar p-0">
    <div class="flex flex-col">
        <p class="menu-title self-start">{i18n.t("words.tabs", { ns: "ui" })}</p>
        <ul class="menu menu-horizontal rounded-box items-center gap-1">
            {#each tabsManager.tabs as tabData, id}
                <Tab {tabData} {id} />
            {/each}
            <li>
                <button onclick={() => tabsManager.add()} class="btn btn-circle btn-ghost btn-xs">
                    <IconWithFallback iconName="plus" size={16}>
                        <PlusIcon size="16" />
                    </IconWithFallback>
                </button>
            </li>
        </ul>
    </div>
</nav>
