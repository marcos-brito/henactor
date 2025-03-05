import { Delete, Create, type CreateArgs, Rename } from "./fs"
import { NewTab } from "./tabs"
import { type Command as CommandKind } from "$lib/bindings";

export {
    Delete, Create, type CreateArgs, Rename, NewTab
}

export interface Command<T> {
    kind: CommandKind
    name: string;
    desc: string;
    keybinds: Array<string>;
    execute(arg: T): Promise<void>;
}

export class Register {
    private commands = new Map<string, Command<any>>;

    public register(cmd: Command<any>): Register {
        this.commands.set(cmd.kind, cmd);
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

    }
}
