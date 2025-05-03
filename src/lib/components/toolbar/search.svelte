<script lang="ts">
    import { FolderSearch2Icon, FolderSearchIcon, SearchIcon } from "lucide-svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { i18n, modalManager } from "$lib";
</script>

<article class="dropdown dropdown-end dropdown-bottom">
    <button class="btn btn-ghost font-normal">
        <IconWithFallback size={20} iconName="tree_view">
            <SearchIcon size="20" />
        </IconWithFallback>
        {i18n.t("toolBar.search.title", { ns: "ui" })}
    </button>
    <ul class="menu dropdown-content rounded-box bg-base-200 z-50 w-52 p-2 shadow-sm">
        <li>
            <button
                onclick={() => {
                    modalManager.show("search:quick");
                }}
            >
                <IconWithFallback size={20} iconName="tree_view">
                    <FolderSearch2Icon size="20" />
                </IconWithFallback>
                {i18n.t("toolBar.search.quickSearch", { ns: "ui" })}
            </button>
        </li>
        <li>
            <button
                onclick={() => {
                    modalManager.show("search:deep");
                }}
            >
                <IconWithFallback size={20} iconName="tree_view">
                    <FolderSearchIcon size="20" />
                </IconWithFallback>
                {i18n.t("toolBar.search.deepSearch", { ns: "ui" })}
            </button>
        </li>
    </ul>
</article>
