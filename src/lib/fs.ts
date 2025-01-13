import { path as pathApi } from "@tauri-apps/api";
import { commands, type EntryType, type Error } from "./bindings";
import { parent } from "$lib/utils";

interface Operation {
    execute(): Promise<void>;
    undo?(): Promise<void>;
}

export class Group implements Operation {
    private operations: Array<Operation> = [];

    constructor(operations: Array<Operation>) {
        this.operations = operations;
    }

    public async execute(): Promise<void> {
        for (const op of this.operations) await op.execute();
    }

    public async undo(): Promise<void> {
        for (const op of this.operations) {
            if (op.undo) await op.undo();
        }
    }
}

export class Delete implements Operation {
    private path: string;

    constructor(path: string) {
        this.path = path;
    }

    public async execute(): Promise<void> {
        await commands.remove(this.path);
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

export class Create implements Operation {
    private args: CreateArgs;

    constructor(args: CreateArgs) {
        this.args = args;
    }

    public async execute(): Promise<void> {
        switch (this.args.kind) {
            case "Directory":
                await commands.createDir(this.args.path);
                break;
            case "File":
                await commands.createFile(this.args.path);
                break;
            case "Symlink":
                await commands.createLink(this.args.original, this.args.link);
                break;
        }
    }

    public async undo(): Promise<void> {
        if (this.args.kind == "Symlink") {
            await commands.remove(this.args.link);
            return;
        }

        await commands.remove(this.args.path);
    }
}

export class Rename implements Operation {
    private target: string;
    private name: string;

    constructor(target: string, name: string) {
        this.target = target;
        this.name = name;
    }

    public async execute(): Promise<void> {
        await commands.rename(this.target, this.renamedPath());
    }

    public async undo(): Promise<void> {
        await commands.rename(this.renamedPath(), this.target);
    }

    private renamedPath(): string {
        return `${parent(this.target)}${pathApi.sep()}${this.name}`;
    }
}

export class FsManager {
    private undoHistory: Array<Operation> = [];
    private redoHistory: Array<Operation> = [];

    public async do(operation: Operation): Promise<void> {
        try {
            await operation.execute();
            this.undoHistory.push(operation);
        } catch (e) {
            console.log(e);
        }
    }

    public async undo() {
        try {
            const op = this.undoHistory.pop();

            if (op?.undo) {
                await op.undo();
                this.redoHistory.push(op);
            }
        } catch (e) {
            console.log(e);
        }
    }

    public async redo() {
        try {
            const op = this.redoHistory.pop();

            if (op) {
                await op.execute();
                this.undoHistory.push(op);
            }
        } catch (e) {
            console.log(e);
        }
    }
}
