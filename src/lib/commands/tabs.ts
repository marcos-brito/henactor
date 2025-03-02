import { tabsManager, i18n, configManager } from "$lib";
import type { Tab } from "$lib/bindings";
import type { Command } from "./index";
import { type Command as CommandKind } from "$lib/bindings";

export class NewTab implements Command<Tab | undefined> {
    public kind: CommandKind = "NewTab";
    public name = i18n.t("tabs.NewTab.name", { ns: "commands" });
    public desc = i18n.t("tabs.NewTab.desc", { ns: "commands" });
    public keybinds = configManager.config.keybinds["NewTab"];

    public async execute(tab?: Tab): Promise<void> {
        tabsManager.add(tab);
    }
}

export class CloseTab implements Command<number> {
    public kind: CommandKind = "CloseTab";
    public name = i18n.t("tabs.CloseTab.name", { ns: "commands" });
    public desc = i18n.t("tabs.CloseTab.desc", { ns: "commands" });;
    public keybinds = configManager.config.keybinds["NewTab"];

    public async execute(idx: number): Promise<void> {
        tabsManager.close(idx);
    }
}

export class NextTab implements Command<{}> {
    public kind: CommandKind = "NextTab";
    public name = i18n.t("tabs.NextTab.name", { ns: "commands" });
    public desc = i18n.t("tabs.NextTab.desc", { ns: "commands" });;
    public keybinds = configManager.config.keybinds["NewTab"];

    public async execute(): Promise<void> {
        tabsManager.next();
    }

    public async undo(): Promise<void> {
        tabsManager.previous();
    }
}

export class PreviousTab implements Command<{}> {
    public kind: CommandKind = "PreviousTab";
    public name = i18n.t("tabs.PreviousTab.name", { ns: "commands" });
    public desc = i18n.t("tabs.PreviousTab.desc", { ns: "commands" });;
    public keybinds = configManager.config.keybinds["NewTab"];

    public async execute(): Promise<void> {
        tabsManager.previous();
    }

    public async undo(): Promise<void> {
        tabsManager.next();
    }
}
