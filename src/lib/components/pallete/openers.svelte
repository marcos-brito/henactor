<script lang="ts">
    import { opener, tabsManager } from "$lib";
    import Base from ".";

    let query = $state("");
    let apps = $state<Array<string>>([]);
    const items = $derived(query.length > 0 ? [query, ...apps] : apps);

    async function findOpeners(): Promise<void> {
        apps = await Promise.all(
            tabsManager.current.selected.map((path) => opener.openersOf(path)),
        ).then((paths) => paths.flat());
    }

    $effect(() => {
        findOpeners();
    });
</script>

<Base
    bind:query
    name="pallete:openers"
    {items}
    getFn={(app) => app}
    executor={async (app) => {
        await Promise.all(tabsManager.current.selected.map((path) => opener.open_with(path, app)));
    }}
></Base>
