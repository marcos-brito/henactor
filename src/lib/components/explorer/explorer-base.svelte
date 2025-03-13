<script lang="ts">
    import { commandRegister, i18n } from "$lib";
    import { type Entry } from "$lib/bindings";
    import type { Command } from "$lib/services";
    import { parent } from "$lib/utils";
    import type { Snippet } from "svelte";
    import {
        type Navigator,
        GridNavigator,
        RegularNavigator,
        NavigatorBase,
    } from "$lib/components/navigator";

    let {
        children,
        entries,
        items,
        container,
        navigator,
        path = $bindable(),
        selected = $bindable(),
    }: {
        children: Snippet;
        entries: Array<Entry>;
        navigator: Navigator;
        items: Array<HTMLElement>;
        container: HTMLElement | undefined;
        path: string;
        selected: Array<string>;
    } = $props();

    function bodyIsFocused(): boolean {
        return document.activeElement == document.body;
    }

    class OpenDir implements Command {
        public identifier = "OpenDir";
        public name = i18n.t("explorer.OpenDir.name", { ns: "commands" });
        public desc = i18n.t("explorer.OpenDir.desc", { ns: "commands" });
        public keybinds = ["Enter"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            const entry = entries[navigator.selected];
            if (entry.entry_type == "Directory") path = entries[navigator.selected].path;
        }
    }

    class CloseDir implements Command {
        public identifier = "CloseDir";
        public name = i18n.t("explorer.CloseDir.name", { ns: "commands" });
        public desc = i18n.t("explorer.CloseDir.desc", { ns: "commands" });
        public keybinds = ["-"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            path = parent(path);
        }
    }

    class Up implements Command {
        public identifier = "Up";
        public name = i18n.t("explorer.Up.name", { ns: "commands" });
        public desc = i18n.t("explorer.Up.desc", { ns: "commands" });
        public keybinds = ["ArrowUp", "k"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            if (navigator instanceof GridNavigator) navigator.up();
            if (navigator instanceof RegularNavigator) navigator.previous();
            if (selectMode) pushSelected();
        }
    }

    class Down implements Command {
        public identifier = "Down";
        public name = i18n.t("explorer.Down.name", { ns: "commands" });
        public desc = i18n.t("explorer.Down.desc", { ns: "commands" });
        public keybinds = ["ArrowDown", "j"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            if (navigator instanceof GridNavigator) navigator.down();
            if (navigator instanceof RegularNavigator) navigator.next();
            if (selectMode) pushSelected();
        }
    }

    class Left implements Command {
        public identifier = "Left";
        public name = i18n.t("explorer.Left.name", { ns: "commands" });
        public desc = i18n.t("explorer.Left.desc", { ns: "commands" });
        public keybinds = ["ArrowLeft", "h"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            if (navigator instanceof GridNavigator) navigator.left();
            if (selectMode) pushSelected();
        }
    }

    class Right implements Command {
        public identifier = "Right";
        public name = i18n.t("explorer.Right.name", { ns: "commands" });
        public desc = i18n.t("explorer.Right.desc", { ns: "commands" });
        public keybinds = ["ArrowRight", "l"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            if (navigator instanceof GridNavigator) navigator.right();
            if (selectMode) pushSelected();
        }
    }

    $effect(() => {
        commandRegister
            .register(new Down())
            .register(new Up())
            .register(new Left())
            .register(new Right())
            .register(new OpenDir())
            .register(new CloseDir());
    });
</script>

<NavigatorBase {items} {container} {navigator}>
    {@render children()}
</NavigatorBase>
