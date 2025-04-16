import type { Command, TabsManager, ModalManager } from "$lib/services";
import type { i18n } from "i18next";

export class NewTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "NewTab";
    public keybinds = ["Control+t"];

    constructor(
        private i18n: i18n,
        private tabsManager: TabsManager,
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.NewTab.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.NewTab.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.tabsManager.add();
    }
}

export class CloseTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "CloseTab";
    public keybinds = ["Control+w"];

    constructor(
        private i18n: i18n,
        private tabsManager: TabsManager,
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.CloseTab.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.CloseTab.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.tabsManager.close(this.tabsManager.currentIdx);
    }
}

export class NextTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "NextTab";
    public keybinds = ["Shift+L"];

    constructor(
        private i18n: i18n,
        private tabsManager: TabsManager,
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.NextTab.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.NextTab.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.tabsManager.next();
    }
}

export class PreviousTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "PreviousTab";
    public keybinds = ["Shift+H"];

    constructor(
        private i18n: i18n,
        private tabsManager: TabsManager,
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.PreviousTab.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.PreviousTab.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.tabsManager.previous();
    }
}

export class RenameCurrentTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "RenameCurrentTab";
    public keybinds = ["Control+r"];

    constructor(
        private i18n: i18n,
        private tabsManager: TabsManager,
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.RenameCurrentTab.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.RenameCurrentTab.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("renameTab", this.tabsManager.current, async (name: string) => {
            this.tabsManager.current.name = name;
        });
    }
}
