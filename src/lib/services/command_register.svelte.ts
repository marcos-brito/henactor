import { SvelteMap } from "svelte/reactivity";
import type { ConfigManager } from ".";

export interface Command {
    identifier: string;
    name: string;
    desc: string;
    keybinds: Array<string>;
    canExecute(): Promise<boolean>;
    canTrigger(): Promise<boolean>;
    execute(): Promise<void>;
}

export class CommandRegister {
    readonly commands = $state(new SvelteMap<string, Command>());
    private keybinds = new Map<string, Array<Command>>();

    constructor(private configManager: ConfigManager) {}

    public register(cmd: Command): CommandRegister {
        this.commands.set(cmd.identifier, cmd);
        if (!this.configManager.config.keybinds[cmd.identifier]) {
            this.configManager.config.keybinds[cmd.identifier] = cmd.keybinds;
        }

        for (const keybind of cmd.keybinds) {
            this.keybinds.set(keybind, [
                ...(this.keybinds.get(keybind)?.filter((c) => c.identifier != cmd.identifier) ||
                    []),
                cmd,
            ]);
        }

        return this;
    }

    public find(query: string): Array<Command> {
        if (this.commands.has(query)) return [this.commands.get(query)!];
        return this.keybinds.get(query) || [];
    }
}
