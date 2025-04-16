import { TabsManager, ModalManager, type Command } from "$lib/services";
import * as actions from "$lib/services/filesystem_actions.svelte";
import { type i18n } from "i18next";

export class Delete implements Command {
    public name: string;
    public desc: string;
    public identifier = "Delete";
    public keybinds = ["Shift+d", "Delete"];

    constructor(
        private i18n: i18n,
        private modalManager: ModalManager,
        private tabsManager: TabsManager,
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
        this.modalManager.show(
            "action:delete",
            this.tabsManager.current.selected,
            async (paths: Array<string>) => {
                if (paths.length == 1)
                    return await this.tabsManager.current.executor.do(new actions.Delete(paths[0]));

                return await this.tabsManager.current.executor.do(
                    new actions.Group(paths.map((path) => new actions.Delete(path))),
                );
            },
        );
    }
}

export class MoveToTrash implements Command {
    public name: string;
    public desc: string;
    public identifier = "MoveToTrash";
    public keybinds = ["d"];

    constructor(
        private i18n: i18n,
        private modalManager: ModalManager,
        private tabsManager: TabsManager,
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
        this.modalManager.show(
            "action:trash",
            this.tabsManager.current.selected,
            async (paths: Array<string>) => {
                if (paths.length == 1)
                    return await this.tabsManager.current.executor.do(new actions.Trash(paths[0]));

                return await this.tabsManager.current.executor.do(
                    new actions.Group(paths.map((path) => new actions.Trash(path))),
                );
            },
        );
    }
}

export class Create implements Command {
    public name: string;
    public desc: string;
    public identifier = "Create";
    public keybinds = ["o"];

    constructor(
        private i18n: i18n,
        private modalManager: ModalManager,
        private tabsManager: TabsManager,
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
        this.modalManager.show("action:create", "", (args) =>
            this.tabsManager.current.executor.do(new actions.Create(args)),
        );
    }
}

export class Rename implements Command {
    public name: string;
    public desc: string;
    public identifier = "Rename";
    public keybinds = ["r"];

    constructor(
        private i18n: i18n,
        private modalManager: ModalManager,
        private tabsManager: TabsManager,
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
        const selected = this.tabsManager.current.selected;

        if (selected.length == 1)
            return this.modalManager.show(
                "action:rename",
                this.tabsManager.current.selected[0],
                async (rename: actions.RenameArgs) => {
                    return await this.tabsManager.current.executor.do(new actions.Rename(rename));
                },
            );

        return this.modalManager.show(
            "action:renameMany",
            this.tabsManager.current.selected,
            async (renames: Array<actions.RenameArgs>) => {
                return await this.tabsManager.current.executor.do(
                    new actions.Group(renames.map((rename) => new actions.Rename(rename))),
                );
            },
        );
    }
}
