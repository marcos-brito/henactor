import { TabsManager, ModalManager } from "$lib/services";
import { Delete, Group, Rename, Trash } from "$lib/services/filesystem_actions.svelte";
import type { i18n } from "i18next";
import { inject } from "inversify";
import { type Command } from "./commands_registry.svelte";
import { collect } from "$lib/collector";

@collect("command")
export class NewTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "NewTab";
    public keybinds = ["Control+t"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
        @inject(ModalManager)
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

@collect("command")
export class CloseTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "CloseTab";
    public keybinds = ["Control+w"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
        @inject(ModalManager)
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

@collect("command")
export class NextTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "NextTab";
    public keybinds = ["Shift+L"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
        @inject(ModalManager)
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

@collect("command")
export class PreviousTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "PreviousTab";
    public keybinds = ["Shift+H"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
        @inject(ModalManager)
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

@collect("command")
export class RenameCurrentTab implements Command {
    public name: string;
    public desc: string;
    public identifier = "RenameCurrentTab";
    public keybinds = ["Control+r"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
        @inject(ModalManager)
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

@collect("command")
export class Commit implements Command {
    public name: string;
    public desc: string;
    public identifier = "Commit";
    public keybinds = ["Control+s"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
        @inject(ModalManager)
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.Commit.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.Commit.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        this.tabsManager.current.executor.add(new Delete("a"));
        this.tabsManager.current.executor.add(new Rename({ name: "a/bcd", target: "b/cde" }));
        this.tabsManager.current.executor.add(new Trash("a"));
        this.tabsManager.current.executor.add(
            new Group([new Trash("a"), new Trash("a"), new Trash("a")]),
        );
        this.tabsManager.current.executor.add(
            new Group([new Trash("a"), new Trash("a"), new Trash("a")]),
        );
        return this.tabsManager.current.executor.staged.length > 0;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("commit", this.tabsManager.current.executor.staged, this.hook);
    }

    private async hook(): Promise<void> {
        this.tabsManager.current.executor.commit();
    }
}
