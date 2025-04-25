import { commands } from "$lib/bindings";
import { path as pathApi } from "@tauri-apps/api";
import { parent } from "$lib/utils";

export interface Action {
    do(): Promise<void>;
    undo?(): Promise<void>;
}

export class Executor {
    readonly undoHistory: Array<Action> = $state([]);
    readonly redoHistory: Array<Action> = $state([]);
    readonly staged: Array<Action> = $state([]);

    public add(action: Action): void {
        this.staged.push(action);
    }

    public async commit(): Promise<void> {
        await this.do(new Group(this.staged));
        this.staged.splice(0, this.staged.length);
    }

    public async do(action: Action): Promise<void> {
        await action.do();
        this.undoHistory.push(action);
    }

    public async undo() {
        const action = this.undoHistory.pop();

        if (action?.undo) {
            await action.undo();
            this.redoHistory.push(action);
        }
    }

    public async redo() {
        const action = this.redoHistory.pop();

        if (action) {
            await action.do();
            this.undoHistory.push();
        }
    }
}

export class Group implements Action {
    constructor(readonly actions: Array<Action>) { }

    async do(): Promise<void> {
        for (const action of this.actions) await action.do();
    }

    async undo(): Promise<void> {
        for (const action of this.actions) if (action.undo) await action.undo();
    }
}

export class Delete implements Action {
    constructor(readonly path: string) { }

    async do(): Promise<void> {
        await commands.remove(this.path);
    }
}

export class Trash implements Action {
    constructor(readonly path: string) { }

    async do(): Promise<void> {
        await commands.trash(this.path);
    }

    async undo(): Promise<void> {
        await commands.restoreTrashed(this.path);
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

export class Create implements Action {
    constructor(readonly args: CreateArgs) { }

    public async do(): Promise<void> {
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

export type RenameArgs = {
    target: string;
    name: string;
};

export class Rename implements Action {
    constructor(readonly args: RenameArgs) { }

    public async do(): Promise<void> {
        await commands.rename(this.args.target, this.renamedPath(this.args));
    }

    public async undo(): Promise<void> {
        await commands.rename(this.renamedPath(this.args), this.args.target);
    }

    private renamedPath(args: RenameArgs): string {
        return `${parent(args.target)}${pathApi.sep()}${args.name}`;
    }
}
