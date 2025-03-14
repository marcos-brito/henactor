<script lang="ts">
    import { commands, type Entry, type EntryType } from "$lib/bindings";
    import { FolderIcon, FolderSymlinkIcon, FileSymlinkIcon, FileIcon } from "lucide-svelte";
    import IconWithFallback from "$lib/components/icon/icon-with-fallback.svelte";
    import { type Snippet } from "svelte";
    import mime from "mime";
    import Icon from "../icon/icon.svelte";
    import { configManager } from "$lib";

    let { entry, size = 16 }: { entry: Entry; size?: number } = $props();

    const icon = $derived.by(() => {
        if (!configManager.currentTheme?.icons?.rules) return null;
        const mimeType = mime.getType(entry.path);

        if (mimeType && Object.hasOwn(configManager.currentTheme.icons.rules, mimeType))
            return configManager.currentTheme.icons.rules[mimeType];

        for (const [pattern, icon] of Object.entries(configManager.currentTheme.icons.rules)) {
            if (entry.path.match(pattern)) return icon;
        }

        return null;
    });

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
    <IconWithFallback {size} iconName="directory">
        <FolderIcon {size} />
    </IconWithFallback>
{/snippet}

{#snippet file()}
    <IconWithFallback {size} iconName="file">
        <FileIcon {size} />
    </IconWithFallback>
{/snippet}

{#snippet link()}
    {#await commands.findLinkTarget(entry.path) then entry}
        {@render symLinkIcons[entry.entry_type]()}
    {/await}
{/snippet}

{#snippet link_file()}
    <IconWithFallback {size} iconName="link_to_file">
        <FileSymlinkIcon {size} />
    </IconWithFallback>
{/snippet}

{#snippet link_directory()}
    <IconWithFallback {size} iconName="link_to_dir">
        <FolderSymlinkIcon {size} />
    </IconWithFallback>
{/snippet}

{#if icon}
    <Icon {size} {icon} />
{:else}
    {@render icons[entry.entry_type]()}
{/if}
