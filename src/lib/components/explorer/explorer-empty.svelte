<script lang="ts">
    import { BirdIcon } from "lucide-svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import ExplorerActions from "./explorer-actions.svelte";
    import { i18n } from "$lib";

    let ref = $state<HTMLElement>();
</script>

{#if ref}
    <ExplorerActions trigger={ref} />
{/if}
<div bind:this={ref} class="flex h-full w-full flex-col justify-center gap-4">
    <IconWithFallback size={160} iconName="empty_dir">
        <BirdIcon strokeWidth={0.5} size={160} />
        <h1 class="text-xl font-bold">{i18n.t("emptyDir", { ns: "ui" })}</h1>
    </IconWithFallback>
</div>
