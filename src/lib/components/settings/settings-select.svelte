<script lang="ts">
    import SettingsField from "./settings-field.svelte";

    let {
        name,
        desc,
        value = $bindable(),
        options,
    }: {
        name: string;
        desc: string;
        value: string;
        options: Array<any>;
    } = $props();
</script>

<SettingsField {name} {desc}>
    <select bind:value class="select select-bordered select-sm">
        <option disabled selected>Pick one</option>
        {#each options as option}
            {#if option == value}
                <option value={option} selected>{option}</option>
            {:else}
                <option value={option}>{option}</option>
            {/if}
        {/each}
    </select>
</SettingsField>
