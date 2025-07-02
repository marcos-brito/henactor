<script lang="ts">
    import Base from ".";

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

<Base {name} {desc}>
    <input {...props} bind:value class="input input-sm input-bordered" />
</Base>
