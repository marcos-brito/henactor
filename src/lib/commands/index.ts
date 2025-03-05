import type { ConfigManager } from "$lib/config.svelte";

export interface Command {
    identifier: string;
    name: string;
    desc: string;
    keybinds: Array<string>;
    canExecute(): Promise<boolean>;
    execute(): Promise<void>;
}

export class Register {
    private commands = new Map<string, Command>();

    constructor(private configManager: ConfigManager) { }

    public register(cmd: Command): Register {
        this.commands.set(cmd.identifier, cmd);
        if (!this.configManager.config.keybinds[cmd.identifier]) {
            this.configManager.config.keybinds[cmd.identifier] = cmd.keybinds;
        }

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
