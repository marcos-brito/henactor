import { tabsManager, i18n, modalManager } from "$lib";
import type { Command } from "$lib/services";

export class NewTab implements Command {
    public identifier = "NewTab";
    public name = i18n.t("tabs.NewTab.name", { ns: "commands" });
    public desc = i18n.t("tabs.NewTab.desc", { ns: "commands" });
    public keybinds = ["Control+t"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        tabsManager.add();
    }
}

export class CloseTab implements Command {
    public identifier = "CloseTab";
    public name = i18n.t("tabs.CloseTab.name", { ns: "commands" });
    public desc = i18n.t("tabs.CloseTab.desc", { ns: "commands" });
    public keybinds = ["Control+w"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        tabsManager.close(tabsManager.currentIdx);
    }
}

export class NextTab implements Command {
    public identifier = "NextTab";
    public name = i18n.t("tabs.NextTab.name", { ns: "commands" });
    public desc = i18n.t("tabs.NextTab.desc", { ns: "commands" });
    public keybinds = ["Shift+l"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        tabsManager.next();
    }
}

export class PreviousTab implements Command {
    public identifier = "PreviousTab";
    public name = i18n.t("tabs.PreviousTab.name", { ns: "commands" });
    public desc = i18n.t("tabs.PreviousTab.desc", { ns: "commands" });
    public keybinds = ["Shift+h"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        tabsManager.previous();
    }
}

export class RenameCurrentTab implements Command {
    public identifier = "RenameCurrentTab";
    public name = i18n.t("tabs.RenameCurrentTab.name", { ns: "commands" });
    public desc = i18n.t("tabs.RenameCurrentTab.desc", { ns: "commands" });
    public keybinds = ["Control+r"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        modalManager.show("renameTab", tabsManager.current, async (name: string) => {
            tabsManager.current.name = name;
        });
    }
}

export class OpenViewPicker implements Command {
    public identifier = "OpenViewPicker";
    public name = i18n.t("tabs.OpenViewPicker.name", { ns: "commands" });
    public desc = i18n.t("tabs.OpenViewPicker.desc", { ns: "commands" });
    public keybinds = ["Control+,"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        modalManager.show("pallete:views");
    }
}

export class OpenSortMethodPicker implements Command {
    public identifier = "OpenSortMethodPicker";
    public name = i18n.t("tabs.OpenSortMethodPicker.name", { ns: "commands" });
    public desc = i18n.t("tabs.OpenSortMethodPicker.desc", { ns: "commands" });
    public keybinds = ["Control+;"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        modalManager.show("pallete:sort");
    }
}
