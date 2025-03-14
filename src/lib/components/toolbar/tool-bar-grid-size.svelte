<script lang="ts">
    import { MinusIcon, PlusIcon } from "lucide-svelte";
    import IconWithFallback from "../icon/icon-with-fallback.svelte";
    import { i18n } from "$lib";
    import { maxGridSize, minGridSize } from "$lib/utils";

    let { gridSize = $bindable() }: { gridSize: number } = $props();
</script>

<article>
    <div
        class="tooltip tooltip-bottom"
        data-tip={i18n.t("toolbar.gridSize.decrease", { ns: "tooltip" })}
    >
        <button
            onclick={() => gridSize--}
            disabled={gridSize == minGridSize}
            class="btn btn-ghost btn-circle btn-sm opacity-70"
        >
            <IconWithFallback size={16} iconName="plus">
                <MinusIcon size={16} />
            </IconWithFallback>
        </button>
    </div>
    <div
        class="tooltip tooltip-left"
        data-tip={i18n.t("toolbar.gridSize.increase", { ns: "tooltip" })}
    >
        <button
            onclick={() => gridSize++}
            disabled={gridSize == maxGridSize}
            class="btn btn-ghost btn-circle btn-sm opacity-70"
        >
            <IconWithFallback size={16} iconName="plus">
                <PlusIcon size={16} />
            </IconWithFallback>
        </button>
    </div>
</article>
