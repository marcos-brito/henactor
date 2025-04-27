import { TabsManager, ModalManager, type Command, ConfigManager } from "$lib/services";
import type { Action } from "$lib/services/filesystem_actions.svelte";
import * as actions from "$lib/services/filesystem_actions.svelte";
import { type i18n } from "i18next";

/**
 * Returns one instance of `action` if `args` length is one or an instance of
 * {@link actions.Group} composed by one `action` for each element in `args` if not
 */
function oneOrGroup<U>(action: new (arg: U) => Action, ...args: Array<U>): Action {
    if (args.length == 1) return new action(args[0]);
    return new actions.Group(args.map((arg) => new action(arg)));
}

/**
 * Adds `action` to the staging area of the current tab if commit mode is active or
 * calls `fallback` if not
 */
function addOrElse(
    configManager: ConfigManager,
    tabsManager: TabsManager,
    action: Action,
    fallback: () => void,
): void {
    if (configManager.config.options.commit_mode) {
        tabsManager.current.executor.add(action);
        return;
    }

    fallback();
}

export class Delete implements Command {
    public name: string;
    public desc: string;
    public identifier = "Delete";
    public keybinds = ["Shift+d", "Delete"];
    public visible = true;

    constructor(
        private i18n: i18n,
        private modalManager: ModalManager,
        private tabsManager: TabsManager,
        private configManager: ConfigManager,
    ) {
        this.name = this.i18n.t("fs.Delete.name", { ns: "commands" });
        this.desc = this.i18n.t("fs.Delete.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return this.tabsManager.current.selected.length > 0;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        addOrElse(
            this.configManager,
            this.tabsManager,
            oneOrGroup(actions.Delete, ...this.tabsManager.current.selected),
            () =>
                this.modalManager.show(
                    "action:delete",
                    this.tabsManager.current.selected,
                    async (paths: Array<string>) => {
                        await this.tabsManager.current.executor.do(
                            oneOrGroup(actions.Delete, ...paths),
                        );
                    },
                ),
        );
    }
}

export class MoveToTrash implements Command {
    public name: string;
    public desc: string;
    public identifier = "MoveToTrash";
    public keybinds = ["d"];
    public visible = true;

    constructor(
        private i18n: i18n,
        private modalManager: ModalManager,
        private tabsManager: TabsManager,
        private configManager: ConfigManager,
    ) {
        this.name = this.i18n.t("fs.MoveToTrash.name", { ns: "commands" });
        this.desc = this.i18n.t("fs.MoveToTrash.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return this.tabsManager.current.selected.length > 0;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        addOrElse(
            this.configManager,
            this.tabsManager,
            oneOrGroup(actions.Trash, ...this.tabsManager.current.selected),
            () =>
                this.modalManager.show(
                    "action:trash",
                    this.tabsManager.current.selected,
                    async (paths: Array<string>) => {
                        await this.tabsManager.current.executor.do(
                            oneOrGroup(actions.Trash, ...paths),
                        );
                    },
                ),
        );
    }
}

export class Create implements Command {
    public name: string;
    public desc: string;
    public identifier = "Create";
    public keybinds = ["o"];
    public visible = true;

    constructor(
        private i18n: i18n,
        private modalManager: ModalManager,
        private tabsManager: TabsManager,
        private configManager: ConfigManager,
    ) {
        this.name = this.i18n.t("fs.Create.name", { ns: "commands" });
        this.desc = this.i18n.t("fs.Create.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("action:create", "", async (args: actions.CreateArgs) => {
            const action = new actions.Create(args);
            addOrElse(this.configManager, this.tabsManager, action, () => {
                this.tabsManager.current.executor.do(action);
            });
        });
    }
}

export class Rename implements Command {
    public name: string;
    public desc: string;
    public identifier = "Rename";
    public keybinds = ["r"];
    public visible = true;

    constructor(
        private i18n: i18n,
        private modalManager: ModalManager,
        private tabsManager: TabsManager,
        private configManager: ConfigManager
    ) {
        this.name = this.i18n.t("fs.Rename.name", { ns: "commands" });
        this.desc = this.i18n.t("fs.Rename.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return this.tabsManager.current.selected.length > 0;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show(
            "action:rename",
            this.tabsManager.current.selected,
            async (renames: Array<actions.RenameArgs>) => {
                const action = oneOrGroup(actions.Rename, ...renames);
                addOrElse(this.configManager, this.tabsManager, action, () => {
                    this.tabsManager.current.executor.do(action);
                });
            },
        );
    }
}
