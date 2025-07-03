import { Group } from ".";

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
