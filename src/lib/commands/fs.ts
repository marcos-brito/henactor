import { type Command } from "./index";
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

    public async execute(): Promise<void> {
        modalManager.show("delete", tabsManager.current.selected, async (paths: Array<string>) => {
            if (paths.length == 1)
                return await tabsManager.current.executor.do(new actions.Delete(paths[0]));

            return await tabsManager.current.executor.do(
                new actions.Group(paths.map((path) => new actions.Delete(path))),
            );
        });
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

    public async execute(): Promise<void> {
        modalManager.show("create", undefined, (args) =>
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

    public async execute(): Promise<void> {
        modalManager.show(
            "rename",
            tabsManager.current.selected,
            async (renames: Array<actions.RenameArgs>) => {
                if (renames.length == 1)
                    return await tabsManager.current.executor.do(new actions.Rename(renames[0]));

                return await tabsManager.current.executor.do(
                    new actions.Group(renames.map((rename) => new actions.Rename(rename))),
                );
            },
        );
    }
}
