<script lang="ts">
    import Base from ".";

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

<Base {name} {desc}>
    <input type="checkbox" bind:checked class="toggle" />
</Base>
