<script lang="ts" generics="T">
    import { configManager, commandRegister, modalManager, i18n } from "$lib";
    import type { Command } from "$lib/services";
    import Fuse from "fuse.js";
    import Modal from "../modal.svelte";
    import { findKeyAlias } from "$lib/utils";
    import type { Snippet } from "svelte";
    import SearchResult from "$lib/components/search-result.svelte";

    let {
        children,
        name,
        items,
        getFn,
        executor,
    }: {
        children: Snippet<[T]>;
        name: string;
        items: Array<T>;
        getFn: (item: T) => string;
        executor: (item: T) => Promise<void>;
    } = $props();

    let query = $state("");
    let open = $state(false);

    const fuse = $derived(
        new Fuse(items, {
            includeMatches: true,
            keys: [{ name: "name", getFn }],
        }),
    );

    const result = $derived(fuse.search(query));

    let container = $state<HTMLElement>();
    let input = $state<HTMLElement>();
    let itemsRef = $state<Array<HTMLElement>>([]);

    let selected = $state(0);
    let selectedItem = $derived.by(() => {
        if (query) return result.at(selected)?.item;
        return items.at(selected);
    });

    $effect(() => {
        if (query) selected = 0;
    });

    $effect(() => {
        if (container) {
            const item = itemsRef[selected].getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            if (item.top < containerRect.top)
                container.scrollBy({ top: item.top - containerRect.top, behavior: "smooth" });

            if (item.bottom > containerRect.bottom)
                container.scrollBy({ top: item.bottom - containerRect.bottom, behavior: "smooth" });
        }
    });

    function maxIdx(): number {
        if (query) return result.length - 1;
        return items.length - 1;
    }

    class PalleteExecute implements Command {
        public identifier = "PalleteExecute";
        public name = i18n.t("pallete.PalleteExecute.name", { ns: "commands" });
        public desc = i18n.t("pallete.PalleteExecute.desc", { ns: "commands" });
        public keybinds = ["Enter"];

        public async canExecute(): Promise<boolean> {
            return open;
        }

        public async execute(): Promise<void> {
            open = false;
            if (selectedItem) await executor(selectedItem);
        }
    }

    class PalletePrevious implements Command {
        public identifier = "PalleteUp";
        public name = i18n.t("pallete.PalletePrevious.name", { ns: "commands" });
        public desc = i18n.t("pallete.PalletePrevious.desc", { ns: "commands" });
        public keybinds = ["ArrowUp", "Control+k"];

        public async canExecute(): Promise<boolean> {
            return open;
        }

        public async execute(): Promise<void> {
            console.log(name);
            if (selected > 0) selected--;
        }
    }

    class PalleteNext implements Command {
        public identifier = "PalleteDown";
        public name = i18n.t("pallete.PalleteNext.name", { ns: "commands" });
        public desc = i18n.t("pallete.PalleteNext.desc", { ns: "commands" });
        public keybinds = ["ArrowDown", "Control+j"];

        public async canExecute(): Promise<boolean> {
            return open;
        }

        public async execute(): Promise<void> {
            if (selected < maxIdx()) selected++;
        }
    }

    commandRegister
        .register(new PalleteExecute())
        .register(new PalletePrevious())
        .register(new PalleteNext());

    $effect(() => {
        if (open)
            commandRegister
                .register(new PalleteExecute())
                .register(new PalletePrevious())
                .register(new PalleteNext());
    });
</script>

<Modal
    bind:open
    {name}
    {modalManager}
    onSubmit={() => {
        if (selectedItem) executor(selectedItem);
    }}
    class="h-3/5 max-w-2xl overflow-hidden"
>
    <div class="grid h-full grid-rows-[10%_85%_5%] gap-3">
        <input
            bind:this={input}
            bind:value={query}
            class="input w-full"
            placeholder={i18n.t("commandPallete.placeHolder", { ns: "ui" })}
            type="text"
        />
        <ul bind:this={container} class="menu menu-md w-full flex-nowrap overflow-y-scroll">
            {#if query}
                {#each result as r, i}
                    <li bind:this={itemsRef[i]}>
                        <button
                            onclick={() => (selected = i)}
                            type="submit"
                            class:menu-active={selected == i}
                            class="flex justify-between"
                        >
                            <SearchResult key="name" {getFn} result={r} />
                            {@render children(r.item)}
                        </button>
                    </li>
                {/each}
            {:else}
                {#each items as item, i}
                    <li bind:this={itemsRef[i]}>
                        <button
                            onclick={() => (selected = i)}
                            type="submit"
                            class:menu-active={selected == i}
                            class="flex justify-between"
                        >
                            <h1>{getFn(item)}</h1>
                            {@render children(item)}
                        </button>
                    </li>
                {/each}
            {/if}
        </ul>
        <article class="flex items-center justify-center gap-3 text-xs">
            <p>
                {i18n.t("commandPallete.controls.navigate", {
                    ns: "ui",
                    previousKey: findKeyAlias(configManager.config.keybinds["PalleteDown"][0]),
                    nextKey: findKeyAlias(configManager.config.keybinds["PalleteUp"][0]),
                })}
            </p>
            <p>
                {i18n.t("commandPallete.controls.use", {
                    ns: "ui",
                    executeKey: findKeyAlias(configManager.config.keybinds["PalleteExecute"][0]),
                })}
            </p>
            <p>
                {i18n.t("commandPallete.controls.dismiss", {
                    ns: "ui",
                    dismissKey: findKeyAlias("esc"),
                })}
            </p>
        </article>
    </div>
</Modal>
