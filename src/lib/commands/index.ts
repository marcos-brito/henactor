
export interface Command {
    name: string;
    desc: string;
    keybinds: Array<string>;
    canExecute(): Promise<boolean>;
    execute(): Promise<void>;
}

export class Register {
    private commands = new Map<string, Command>();

    public register(cmd: Command<any>): Register {
        this.commands.set(cmd.kind, cmd);
    public register(cmd: Command): Register {
        this.commands.set(cmd.identifier, cmd);
        for (const keybind of cmd.keybinds) {
            this.commands.set(keybind, cmd);
        }

        return this;
    }

    public find(query: string): Command | undefined {
        return this.commands.get(query);
    }

    public all(): Array<Command> {
        return Array.from(new Set(this.commands.values()));
    }
}
