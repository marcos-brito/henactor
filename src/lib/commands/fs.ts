import { type Command } from "$lib/services";
import { i18n, modalManager, tabsManager } from "$lib";
import * as actions from "$lib/services/filesystem_actions.svelte";

export class Delete implements Command {
    public identifier = "Delete";
    public name = i18n.t("fs.Delete.name", { ns: "commands" });
    public desc = i18n.t("fs.Delete.desc", { ns: "commands" });
    public keybinds = ["Shift+d", "Delete"];

    public async canExecute(): Promise<boolean> {
        return tabsManager.current.selected.length > 0;
    }

    public async canTrigger(): Promise<boolean> {
        return modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        modalManager.show(
            "action:delete",
            tabsManager.current.selected,
            async (paths: Array<string>) => {
                if (paths.length == 1)
                    return await tabsManager.current.executor.do(new actions.Delete(paths[0]));

                return await tabsManager.current.executor.do(
                    new actions.Group(paths.map((path) => new actions.Delete(path))),
                );
            },
        );
    }
}

export class MoveToTrash implements Command {
    public identifier = "MoveToTrash";
    public name = i18n.t("fs.MoveToTrash.name", { ns: "commands" });
    public desc = i18n.t("fs.MoveToTrash.desc", { ns: "commands" });
    public keybinds = ["d"];

    public async canExecute(): Promise<boolean> {
        return tabsManager.current.selected.length > 0;
    }

    public async canTrigger(): Promise<boolean> {
        return modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        modalManager.show(
            "action:trash",
            tabsManager.current.selected,
            async (paths: Array<string>) => {
                if (paths.length == 1)
                    return await tabsManager.current.executor.do(new actions.Trash(paths[0]));

                return await tabsManager.current.executor.do(
                    new actions.Group(paths.map((path) => new actions.Trash(path))),
                );
            },
        );
    }
}

export class Create implements Command {
    public identifier = "Create";
    public name = i18n.t("fs.Create.name", { ns: "commands" });
    public desc = i18n.t("fs.Create.desc", { ns: "commands" });
    public keybinds = ["o"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        modalManager.show("action:create", "", (args) =>
            tabsManager.current.executor.do(new actions.Create(args)),
        );
    }
}

export class Rename implements Command {
    public identifier = "Rename";
    public name = i18n.t("fs.Rename.name", { ns: "commands" });
    public desc = i18n.t("fs.Rename.desc", { ns: "commands" });
    public keybinds = ["r"];

    public async canExecute(): Promise<boolean> {
        return tabsManager.current.selected.length > 0;
    }

    public async canTrigger(): Promise<boolean> {
        return modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        const selected = tabsManager.current.selected;

        if (selected.length == 1)
            return modalManager.show(
                "action:rename",
                tabsManager.current.selected[0],
                async (rename: actions.RenameArgs) => {
                    return await tabsManager.current.executor.do(new actions.Rename(rename));
                },
            );

        return modalManager.show(
            "action:renameMany",
            tabsManager.current.selected,
            async (renames: Array<actions.RenameArgs>) => {
                return await tabsManager.current.executor.do(
                    new actions.Group(renames.map((rename) => new actions.Rename(rename))),
                );
            },
        );
    }
}
