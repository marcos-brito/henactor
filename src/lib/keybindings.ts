import { get } from "svelte/store";
import type { Command } from "../bindings";
import { config } from "./config";


type Action = () => void;
type KeyBindings = Record<Command, Array<string>>;

export class KeyManager {
    private keybindings: KeyBindings;
    private holding = new Array<string>;
    private actions = new Map<Command, Action>;

    constructor() {
        this.keybindings = get(config).keybindings
        config.subscribe((config) => this.keybindings = config.keybindings)
    }

    public on(cmd: Command, action: Action): void {
        this.actions.set(cmd, action);
    }

    public listen(node: HTMLElement): void {
        node.addEventListener("keydown", (e) => this.handleKeyDown(e))
        node.addEventListener("keyup", (e) => this.handleKeyUp(e))
    }

    public handleKeyDown(e: KeyboardEvent): void {
        this.holding.push(e.key);
        const fullBinding = this.holding.join('+');

        for (const [cmd, keys] of Object.entries(this.keybindings)) {
            if (keys.includes(fullBinding)) {
                const action = this.actions.get(cmd as Command)
                if (action) action()
            }
        }
    }

    public handleKeyUp(e: KeyboardEvent): void {
        this.holding = this.holding.filter(key => key != e.key)
    }
}
