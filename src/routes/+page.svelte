<script lang="ts">
    import { app } from "$lib/app.svelte";
    import Toolbar from "$lib/components/tool-bar.svelte";
</script>

<Toolbar bind:view={app.tabs.current.view} bind:path={app.tabs.current.path} />
