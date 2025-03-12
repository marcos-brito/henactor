<script lang="ts">
    import ItemBase from "./item-base.svelte";

    let {
        name,
        desc,
        value = $bindable(),
        ...props
    }: {
        name: string;
        desc: string;
        value: any;
        [key: string]: any;
    } = $props();
</script>

<ItemBase {name} {desc}>
    <input {...props} bind:value class="input input-sm input-bordered" />
</ItemBase>
