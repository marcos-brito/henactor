<script lang="ts">
    import SettingsField from "./settings-field.svelte";

    let {
        name,
        desc,
        value = $bindable(),
    }: {
        name: string;
        desc: string;
        value: any;
    } = $props();
</script>

<SettingsField {name} {desc}>
    <input type="text" bind:value class="input input-sm input-bordered" />
</SettingsField>
