<script lang="ts">
    import { commands, type Entry, type EntryType } from "$lib/bindings";
    import { FolderIcon, FolderSymlinkIcon, FileSymlinkIcon, FileIcon } from "lucide-svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { type Snippet } from "svelte";

    let { entry }: { entry: Entry } = $props();

    let icons: Record<EntryType, Snippet> = {
        File: file,
        Directory: directory,
        Symlink: link,
    };

    let symLinkIcons: Record<EntryType, Snippet> = {
        File: link_file,
        Directory: link_directory,
        Symlink: link,
    };
</script>

{#snippet directory()}
    <IconWithFallback iconName="directory">
        <FolderIcon />
    </IconWithFallback>
{/snippet}

{#snippet file()}
    <IconWithFallback iconName="file">
        <FileIcon />
    </IconWithFallback>
{/snippet}

{#snippet link()}
    {#await commands.findLinkTarget(entry.path) then entry}
        {@render symLinkIcons[entry.entry_type]()}
    {/await}
{/snippet}

{#snippet link_file()}
    <IconWithFallback iconName="link_to_file">
        <FileSymlinkIcon />
    </IconWithFallback>
{/snippet}

{#snippet link_directory()}
    <IconWithFallback iconName="link_to_dir">
        <FolderSymlinkIcon />
    </IconWithFallback>
{/snippet}

{@render icons[entry.entry_type]()}
