import type { Command, ModalManager, TabsManager } from "$lib/services";
import type { i18n } from "i18next";

export class IncreaseGridSize implements Command {
    public name: string;
    public desc: string;
    public identifier = "IncreaseGridSize";
    public keybinds = ["Shift++"];

    constructor(
        private i18n: i18n,
        private tabsManager: TabsManager,
        private modalManager: ModalManager,
        private maxGridSize: number,
    ) {
        this.name = this.i18n.t("explorer.IncreaseGridSize.name", { ns: "commands" });
        this.desc = this.i18n.t("explorer.IncreaseGridSize.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return (
            this.tabsManager.current.view == "Grid" &&
            this.tabsManager.current.grid_size < this.maxGridSize
        );
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.tabsManager.current.grid_size++;
    }
}

export class DecreaseGridSize implements Command {
    public name: string;
    public desc: string;
    public identifier = "DecreaseGridSize";
    public keybinds = ["Shift+_"];

    constructor(
        private i18n: i18n,
        private tabsManager: TabsManager,
        private modalManager: ModalManager,
        private minGridSize: number,
    ) {
        this.name = this.i18n.t("explorer.DecreaseGridSize.name", { ns: "commands" });
        this.desc = this.i18n.t("explorer.DecreaseGridSize.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return (
            this.tabsManager.current.view == "Grid" &&
            this.tabsManager.current.grid_size > this.minGridSize
        );
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.tabsManager.current.grid_size--;
    }
}
    public identifier = "DecreaseGridSize";
    public name = i18n.t("explorer.DecreaseGridSize.name", { ns: "commands" });
    public desc = i18n.t("explorer.DecreaseGridSize.desc", { ns: "commands" });
    public keybinds = ["Shift+_"];

    public async canExecute(): Promise<boolean> {
        return tabsManager.current.view == "Grid" && tabsManager.current.grid_size > minGridSize;
    }

    public async execute(): Promise<void> {
        tabsManager.current.grid_size--;
    }
}
