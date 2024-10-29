<script lang="ts">
    import SettingsField from "./settings-field.svelte";

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

<SettingsField {name} {desc}>
    <input {...props} bind:value class="input input-sm input-bordered" />
</SettingsField>
