<script lang="ts">
    import { container as diContainer, i18n, modalManager } from "$lib";
    import { type Entry } from "$lib/bindings";
    import type { Command } from "$lib/services";
    import { isDir, parent } from "$lib/utils";
    import type { Snippet } from "svelte";
    import { path as pathApi } from "@tauri-apps/api";
    import {
        type Navigator,
        GridNavigator,
        RegularNavigator,
        NavigatorBase,
    } from "$lib/components/navigator";
    import { CommandRegister } from "$lib/services/command";

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

    let selectMode = $state(false);
    let selectModeStart = $state(0);

    function pushSelected(): void {
        if (navigator.selected > selectModeStart) {
            selected.push(...entries.slice(selectModeStart, navigator.selected).map((e) => e.path));
        } else {
            selected.push(...entries.slice(navigator.selected, selectModeStart).map((e) => e.path));
        }
    }

    function toggleMark(path: string): void {
        if (!selected.includes(path)) {
            selected.push(path);
            return;
        }

        selected.splice(
            selected.findIndex((p) => p == path),
            1,
        );
    }

    class OpenDir implements Command {
        public identifier = "OpenDir";
        public name = i18n.t("explorer.OpenDir.name", { ns: "commands" });
        public desc = i18n.t("explorer.OpenDir.desc", { ns: "commands" });
        public keybinds = ["Enter"];
        public visible = true;

        public async canExecute(): Promise<boolean> {
            return isDir(entries[navigator.selected]);
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
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
        public visible = true;

        public async canExecute(): Promise<boolean> {
            return path != pathApi.sep();
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
        }

        public async execute(): Promise<void> {
            path = parent(path);
        }
    }

    class ToggleMark implements Command {
        public name = i18n.t("explorer.ToggleMark.name", { ns: "commands" });
        public desc = i18n.t("explorer.ToggleMark.desc", { ns: "commands" });
        public identifier = "ToggleMark";
        public keybinds = ["m"];
        public visible = true;

        public async canExecute(): Promise<boolean> {
            return true;
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
        }

        public async execute(): Promise<void> {
            toggleMark(entries[navigator.selected].path);
        }
    }

    class SelectModeOn implements Command {
        public identifier = "SelectOn";
        public name = i18n.t("explorer.SelectModeOn.name", { ns: "commands" });
        public desc = i18n.t("explorer.SelectModeOn.desc", { ns: "commands" });
        public keybinds = ["v"];
        public visible = true;

        public async canExecute(): Promise<boolean> {
            return !selectMode;
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
        }

        public async execute(): Promise<void> {
            selectModeStart = navigator.selected;
            selectMode = true;
        }
    }

    class SelectModeOff implements Command {
        public identifier = "SelectOff";
        public name = i18n.t("explorer.SelectModeOff.name", { ns: "commands" });
        public desc = i18n.t("explorer.SelectModeOff.desc", { ns: "commands" });
        public keybinds = ["Escape"];
        public visible = true;

        public async canExecute(): Promise<boolean> {
            return selectMode;
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
        }

        public async execute(): Promise<void> {
            selectMode = false;
        }
    }

    class ClearSelection implements Command {
        public identifier = "ClearSelection";
        public name = i18n.t("explorer.ClearSelection.name", { ns: "commands" });
        public desc = i18n.t("explorer.ClearSelection.desc", { ns: "commands" });
        public keybinds = ["Escape"];
        public visible = true;

        public async canExecute(): Promise<boolean> {
            return !selectMode;
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
        }

        public async execute(): Promise<void> {
            selected.splice(0, selected.length);
        }
    }

    class Up implements Command {
        public identifier = "Up";
        public name = i18n.t("explorer.Up.name", { ns: "commands" });
        public desc = i18n.t("explorer.Up.desc", { ns: "commands" });
        public keybinds = ["ArrowUp", "k"];
        public visible = false;

        public async canExecute(): Promise<boolean> {
            return true;
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
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
        public visible = false;

        public async canExecute(): Promise<boolean> {
            return true;
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
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
        public visible = false;

        public async canExecute(): Promise<boolean> {
            return true;
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
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
        public visible = false;

        public async canExecute(): Promise<boolean> {
            return true;
        }

        public async canTrigger(): Promise<boolean> {
            return modalManager.allClosed();
        }

        public async execute(): Promise<void> {
            if (navigator instanceof GridNavigator) navigator.right();
            if (selectMode) pushSelected();
        }
    }

    $effect(() => {
        diContainer
            .get(CommandRegister)
            .register(new Down())
            .register(new Up())
            .register(new Left())
            .register(new Right())
            .register(new ToggleMark())
            .register(new SelectModeOn())
            .register(new SelectModeOff())
            .register(new ClearSelection())
            .register(new OpenDir())
            .register(new CloseDir());
    });
</script>

<NavigatorBase {items} {container} {navigator}>
    {@render children()}
</NavigatorBase>
