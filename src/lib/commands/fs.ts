import { commands } from "../bindings";
import { type Command } from "./index";
import { path as pathApi } from "@tauri-apps/api";
import { parent } from "../utils";
import { type Command as CommandKind } from "$lib/bindings";
import { configManager, i18n } from "$lib";

export class Delete implements Command<string> {
    public kind: CommandKind = "Delete";
    public name = i18n.t("fs.Delete.name", { ns: "commands" })
    public desc = i18n.t("fs.Delete.desc", { ns: "commands" })
    public keybinds = configManager.config.keybinds["Delete"];


    public async execute(path: string): Promise<void> {
        await commands.remove(path);
    }
}

export type CreateArgs =
    | {
        path: string;
        kind: "Directory" | "File";
    }
    | {
        original: string;
        link: string;
        kind: "Symlink";
    };

export class Create implements Command<CreateArgs> {
    public kind: CommandKind = "Create";
    public name = i18n.t("fs.Create.name", { ns: "commands" })
    public desc = i18n.t("fs.Create.desc", { ns: "commands" })
    public keybinds = configManager.config.keybinds["Create"];

    public async execute(args: CreateArgs): Promise<void> {
        switch (args.kind) {
            case "Directory":
                await commands.createDir(args.path);
                break;
            case "File":
                await commands.createFile(args.path);
                break;
            case "Symlink":
                await commands.createLink(args.original, args.link);
                break;
        }
    }

    public async undo(args: CreateArgs): Promise<void> {
        if (args.kind == "Symlink") {
            await commands.remove(args.link);
            return;
        }

        await commands.remove(args.path);
    }
}

export type RenameArgs = {
    target: string,
    name: string,
}

export class Rename implements Command<RenameArgs> {
    public kind: CommandKind = "Rename";
    public name = i18n.t("fs.Rename.name", { ns: "commands" })
    public desc = i18n.t("fs.Rename.desc", { ns: "commands" })
    public keybinds = configManager.config.keybinds["Rename"];

    public async execute(args: RenameArgs): Promise<void> {
        await commands.rename(args.target, this.renamedPath(args));
    }

    public async undo(args: RenameArgs): Promise<void> {
        await commands.rename(this.renamedPath(args), args.target);
    }

    private renamedPath(args: RenameArgs): string {
        return `${parent(args.target)}${pathApi.sep()}${args.name}`;
    }
}
