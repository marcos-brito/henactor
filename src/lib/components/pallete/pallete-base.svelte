<script lang="ts" generics="T">
    import { configManager, commandRegister, modalManager, i18n } from "$lib";
    import type { Command } from "$lib/services";
    import Fuse from "fuse.js";
    import Modal from "../modal.svelte";
    import { findKeyAlias } from "$lib/utils";
    import type { Snippet } from "svelte";
    import SearchResult from "$lib/components/search-result.svelte";
    import { NavigatorBase, RegularNavigator } from "$lib/components/navigator";

    let {
        children,
        name,
        items,
        query = $bindable(""),
        getFn,
        executor,
    }: {
        children?: Snippet<[T]>;
        name: string;
        items: Array<T>;
        query?: string;
        getFn: (item: T) => string;
        executor: (item: T) => Promise<void>;
    } = $props();

    const navigator = $derived(new RegularNavigator(items.length - 1));
    const result = $derived(
        new Fuse(items, {
            includeMatches: true,
            keys: [{ name: "name", getFn }],
        }).search(query),
    );

    let selectedItem = $derived(items[navigator.selected]);
    let open = $state(false);
    let container = $state<HTMLElement>();
    let itemsRef = $state<Array<HTMLElement>>([]);
    let input: HTMLElement;

    $effect(() => {
        if (query) navigator.selected = 0;
    });

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

    class PalleteComplete implements Command {
        public identifier = "PalleteComplete";
        public name = i18n.t("pallete.PalleteComplete.name", { ns: "commands" });
        public desc = i18n.t("pallete.PalleteComplete.desc", { ns: "commands" });
        public keybinds = ["Tab"];

        public async canExecute(): Promise<boolean> {
            return open;
        }

        public async execute(): Promise<void> {
            if (selectedItem) query = getFn(selectedItem);
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
            navigator.previous();
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
            navigator.next();
        }
    }

    // HACK: doing it twice so it shows on the settings before open a pallete
    commandRegister
        .register(new PalleteExecute())
        .register(new PalleteComplete())
        .register(new PalletePrevious())
        .register(new PalleteNext());

    $effect(() => {
        if (open)
            commandRegister
                .register(new PalleteExecute())
                .register(new PalleteComplete())
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
            placeholder={i18n.t("pallete.placeHolder", { ns: "ui" })}
            type="text"
        />
        <NavigatorBase items={itemsRef} {container} {navigator}>
            <ul bind:this={container} class="menu menu-md w-full flex-nowrap overflow-y-scroll">
                {#if query}
                    {#each result as r, i}
                        <li bind:this={itemsRef[i]}>
                            <button
                                onclick={() => (navigator.selected = i)}
                                type="submit"
                                class:menu-active={navigator.selected == i}
                                class="flex justify-between"
                            >
                                <SearchResult key="name" {getFn} result={r} />
                                {#if children}
                                    {@render children(r.item)}
                                {/if}
                            </button>
                        </li>
                    {/each}
                {:else}
                    {#each items as item, i}
                        <li bind:this={itemsRef[i]}>
                            <button
                                onclick={() => (navigator.selected = i)}
                                type="submit"
                                class:menu-active={navigator.selected == i}
                                class="flex justify-between"
                            >
                                <h1>{getFn(item)}</h1>
                                {#if children}
                                    {@render children(item)}
                                {/if}
                            </button>
                        </li>
                    {/each}
                {/if}
            </ul>
        </NavigatorBase>
        <article class="flex items-center justify-center gap-3 text-xs">
            <p>
                {i18n.t("pallete.controls.navigate", {
                    ns: "ui",
                    previousKey: findKeyAlias(configManager.config.keybinds["PalleteDown"][0]),
                    nextKey: findKeyAlias(configManager.config.keybinds["PalleteUp"][0]),
                })}
            </p>
            <p>
                {i18n.t("pallete.controls.use", {
                    ns: "ui",
                    executeKey: findKeyAlias(configManager.config.keybinds["PalleteExecute"][0]),
                })}
            </p>
            <p>
                {i18n.t("pallete.controls.complete", {
                    ns: "ui",
                    completeKey: findKeyAlias(configManager.config.keybinds["PalleteComplete"][0]),
                })}
            </p>
            <p>
                {i18n.t("pallete.controls.dismiss", {
                    ns: "ui",
                    dismissKey: findKeyAlias("Escape"),
                })}
            </p>
        </article>
    </div>
</Modal>
