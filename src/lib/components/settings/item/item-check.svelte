<script lang="ts">
    import ItemBase from "./item-base.svelte";

    let {
        name,
        desc,
        checked = $bindable(),
    }: {
        name: string;
        desc: string;
        checked: boolean;
    } = $props();
</script>

<ItemBase {name} {desc}>
    <input type="checkbox" bind:checked class="toggle" />
</ItemBase>
