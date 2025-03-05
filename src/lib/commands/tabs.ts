import { tabsManager, i18n, configManager } from "$lib";
import type { Command } from "./index";

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
