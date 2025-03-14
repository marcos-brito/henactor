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

    let selectMode = $state(false);
    let selectModeStart = $state(0);

    function pushSelected(): void {
        if (navigator.selected > selectModeStart) {
            selected.push(...entries.slice(selectModeStart, navigator.selected).map((e) => e.path));
        } else {
            selected.push(...entries.slice(navigator.selected, selectModeStart).map((e) => e.path));
        }
    }

    function bodyIsFocused(): boolean {
        return document.activeElement == document.body;
    }

    function toggleMark(path: string) {
        if (selected.includes(path)) {
            selected.splice(
                selected.findIndex((p) => p == path),
                1,
            );
        } else {
            selected.push(path);
        }
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

    class Start implements Command {
        public identifier = "Start";
        public name = i18n.t("explorer.Start.name", { ns: "commands" });
        public desc = i18n.t("explorer.Start.desc", { ns: "commands" });
        public keybinds = ["g"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            navigator.first();
        }
    }

    class End implements Command {
        public identifier = "End";
        public name = i18n.t("explorer.End.name", { ns: "commands" });
        public desc = i18n.t("explorer.End.desc", { ns: "commands" });
        public keybinds = ["Shift+G"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            navigator.last();
        }
    }

    class PageForward implements Command {
        public identifier = "PageForward";
        public name = i18n.t("explorer.PageForward.name", { ns: "commands" });
        public desc = i18n.t("explorer.PageForward.desc", { ns: "commands" });
        public keybinds = ["Control+f"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            navigator.pageForward();
        }
    }

    class PageBackward implements Command {
        public identifier = "PageForward";
        public name = i18n.t("explorer.PageBackward.name", { ns: "commands" });
        public desc = i18n.t("explorer.PageBackward.desc", { ns: "commands" });
        public keybinds = ["Control+b"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            navigator.pageBackward();
        }
    }

    class HalfPageForward implements Command {
        public identifier = "HalfForward";
        public name = i18n.t("explorer.HalfPageForward.name", { ns: "commands" });
        public desc = i18n.t("explorer.HalfPageForward.desc", { ns: "commands" });
        public keybinds = ["Control+d"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            navigator.halfPageForward();
        }
    }

    class HalfPageBackward implements Command {
        public identifier = "HalfBackward";
        public name = i18n.t("explorer.HalfPageBackward.name", { ns: "commands" });
        public desc = i18n.t("explorer.HalfPageBackward.desc", { ns: "commands" });
        public keybinds = ["Control+u"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused();
        }

        public async execute(): Promise<void> {
            navigator.halfPageBackward();
        }
    }

    class SelectModeOn implements Command {
        public identifier = "SelectOn";
        public name = i18n.t("explorer.SelectModeOn.name", { ns: "commands" });
        public desc = i18n.t("explorer.SelectModeOn.desc", { ns: "commands" });
        public keybinds = ["v"];

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused() && !selectMode;
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

        public async canExecute(): Promise<boolean> {
            return bodyIsFocused() && selectMode;
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

        public async canExecute(): Promise<boolean> {
            return !selectMode;
        }

        public async execute(): Promise<void> {
            selected.splice(0, selected.length);
        }
    }

    class ToggleMark implements Command {
        public identifier = "ToggleMark";
        public name = i18n.t("explorer.ToggleMark.name", { ns: "commands" });
        public desc = i18n.t("explorer.ToggleMark.desc", { ns: "commands" });
        public keybinds = ["m"];

        public async canExecute(): Promise<boolean> {
            return true;
        }

        public async execute(): Promise<void> {
            toggleMark(entries[navigator.selected].path);
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
            .register(new ToggleMark())
            .register(new SelectModeOn())
            .register(new SelectModeOff())
            .register(new ClearSelection())
            .register(new OpenDir())
            .register(new CloseDir())
            // Scrolling
            .register(new Start())
            .register(new End())
            .register(new PageForward())
            .register(new PageBackward())
            .register(new HalfPageBackward())
            .register(new HalfPageForward())
            .register(new HalfPageBackward());
    });
</script>

<NavigatorBase {items} {container} {navigator}>
    {@render children()}
</NavigatorBase>
