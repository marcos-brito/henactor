<script lang="ts">
    import Base from ".";

    let {
        name,
        desc,
        value = $bindable(),
        options,
        onChange,
    }: {
        name: string;
        desc: string;
        value: string;
        options: ReadonlyArray<any>;
        onChange?: (value: string) => void;
    } = $props();
</script>

<Base {name} {desc}>
    <select
        onchange={() => {
            if (onChange) {
                onChange(value);
            }
        }}
        bind:value
        class="select select-bordered select-sm"
    >
        <option disabled selected>Pick one</option>
        {#each options as option}
            {#if option == value}
                <option value={option} selected>{option}</option>
            {:else}
                <option value={option}>{option}</option>
            {/if}
        {/each}
    </select>
</Base>
