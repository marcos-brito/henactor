<script lang="ts">
    import { Menu, Item, Sep } from "$lib/components/context-menu";
    import Keybinder from "$lib/components/keybinder.svelte";
    let {
        trigger,
    }: {
        trigger: HTMLElement;
    } = $props();

    let createIsOpen = $state(false);
</script>

<Menu {trigger}>
    <Item onclick={() => {}}>{$_("menu.explorer.paste")}</Item>
    <Sep />
    <Item onclick={() => {}}>{$_("menu.explorer.details")}</Item>
</Menu>
<Keybinder
    {trigger}
<Keybinder
    actions={{
        FocusExplorer: () => {
            trigger.focus();
        },
    }}
/>
/>
