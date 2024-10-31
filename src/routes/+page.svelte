<script lang="ts">
    import { app } from "$lib/app.svelte";
    import Toolbar from "$lib/components/tool-bar.svelte";
</script>

{#if app.tabs.current}
    <Toolbar bind:view={app.tabs.current.view} bind:path={app.tabs.current.path} />
{/if}
