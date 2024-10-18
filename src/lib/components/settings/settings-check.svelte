<script lang="ts">
    import SettingsField from "./settings-field.svelte";

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

<SettingsField {name} {desc}>
    <input type="checkbox" bind:checked class="toggle" />
</SettingsField>
