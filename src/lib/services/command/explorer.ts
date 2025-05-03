import { ModalManager, TabsManager } from "$lib/services";
import { type Command } from "./commands_registry.svelte";
import { collect } from "$lib/collector";
import { type i18n } from "i18next";
import { inject } from "inversify";
import { maxGridSize, minGridSize } from "$lib/utils";

@collect("command")
export class IncreaseGridSize implements Command {
    public name: string;
    public desc: string;
    public identifier = "IncreaseGridSize";
    public keybinds = ["Shift++"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
        @inject(TabsManager)
        private tabsManager: TabsManager,
    ) {
        this.name = this.i18n.t("explorer.IncreaseGridSize.name", { ns: "commands" });
        this.desc = this.i18n.t("explorer.IncreaseGridSize.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
        // return (
        //     this.tabsManager.current.view == "Grid" &&
        //     this.tabsManager.current.grid_size < maxGridSize
        // );
    }

    public async canTrigger(): Promise<boolean> {
        // return this.modalManager.allClosed();
        return true;
    }

    public async execute(): Promise<void> {
        // this.tabsManager.current.grid_size++;
    }
}

@collect("command")
export class DecreaseGridSize implements Command {
    public name: string;
    public desc: string;
    public identifier = "DecreaseGridSize";
    public keybinds = ["Shift+_"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
        @inject(TabsManager)
        private tabsManager: TabsManager,
    ) {
        this.name = this.i18n.t("explorer.DecreaseGridSize.name", { ns: "commands" });
        this.desc = this.i18n.t("explorer.DecreaseGridSize.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return (
            this.tabsManager.current.view == "Grid" &&
            this.tabsManager.current.grid_size > minGridSize
        );
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.tabsManager.current.grid_size--;
    }
}
