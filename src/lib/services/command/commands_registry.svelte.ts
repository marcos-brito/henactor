import { SvelteMap } from "svelte/reactivity";
import { ConfigManager } from "$lib/services";
import { inject, injectable } from "inversify";

type Class<T> = new (...args: any[]) => T;

const commands = new Set<Class<Command>>();

export function command(target: Class<Command>): void {
    commands.add(target);
}

export function allCommands(): Array<Class<Command>> {
    return Array.from(commands);
}

export interface Command {
    identifier: string;
    name: string;
    desc: string;
    visible: boolean;
    keybinds: Array<string>;
    canExecute(): Promise<boolean>;
    canTrigger(): Promise<boolean>;
    execute(): Promise<void>;
}

@injectable()
export class CommandRegister {
    readonly commands = $state(new SvelteMap<string, Command>());
    private keybinds = new Map<string, Array<Command>>();

    constructor(
        @inject(ConfigManager)
        private configManager: ConfigManager,
    ) {}

    public registerMany(...cmds: Array<Command>): void {
        for (const cmd of cmds) this.register(cmd);
    }

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
