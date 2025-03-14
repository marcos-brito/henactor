<script lang="ts">
    import { BirdIcon } from "lucide-svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import ExplorerBase from "./explorer-base.svelte";
    import { i18n } from "$lib";
    import { GridNavigator } from "../navigator";

    let { path = $bindable() }: { path: string } = $props();

    const navigator = new GridNavigator(0, 0);
</script>

<ExplorerBase {navigator} bind:path items={[]} container={undefined} entries={[]} selected={[]}>
    <div class="flex h-full w-full flex-col justify-center gap-4">
        <IconWithFallback size={160} iconName="empty_dir">
            <BirdIcon strokeWidth={0.5} size={160} />
        </IconWithFallback>
        <h1 class="text-xl font-bold">{i18n.t("emptyDir", { ns: "ui" })}</h1>
    </div>
</ExplorerBase>
