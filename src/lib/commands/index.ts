import { Delete, Create, type CreateArgs, Rename } from "./fs"
import { NewTab } from "./tabs"

export {
    Delete, Create, type CreateArgs, Rename, NewTab
}

export interface Command<T> {
    name: string;
    desc: string;
    keybinds: Array<string>;
    execute(arg: T): Promise<void>;
    undo?(arg: T): Promise<void>;
}

export class Register {
    private commands = new Map<string, Command<any>>;

    public register(cmd: Command<any>): Register {
        this.commands.set(cmd.name, cmd);
        for (const keybind of cmd.keybinds) {
            this.commands.set(keybind, cmd);
        }

        return this;
    }

    public find(query: string): Command<any> | undefined {
        return this.commands.get(query);
    }

    public all(): Array<Command<any>> {
        return Array.from(this.commands.values());
    }
}

type HistoryEntry = {
    cmd: Command<any>,
    arg: any,
}

export class Executor {
    private undoHistory: Array<HistoryEntry> = [];
    private redoHistory: Array<HistoryEntry> = [];

    public async do<T>(cmd: Command<T>, arg: T): Promise<void> {
        await cmd.execute(arg);
        this.undoHistory.push({ cmd, arg });
    }

    public async undo() {
        const entry = this.undoHistory.pop();

        if (entry?.cmd?.undo) {
            await entry.cmd.undo(entry.arg);
            this.redoHistory.push(entry);
        }
    }

    public async redo() {
        const entry = this.redoHistory.pop();

        if (entry?.cmd?.undo) {
            await entry.cmd.undo(entry.arg);
            this.undoHistory.push(entry);
        }
    }
}
