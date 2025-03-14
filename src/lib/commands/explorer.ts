import { i18n, tabsManager } from "$lib";
import type { Command } from "$lib/services";
import { maxGridSize, minGridSize } from "$lib/utils";

export class IncreaseGridSize implements Command {
    public identifier = "IncreaseGridSize";
    public name = i18n.t("explorer.IncreaseGridSize.name", { ns: "commands" });
    public desc = i18n.t("explorer.IncreaseGridSize.desc", { ns: "commands" });
    public keybinds = ["Shift++"];

    public async canExecute(): Promise<boolean> {
        return tabsManager.current.view == "Grid" && tabsManager.current.grid_size < maxGridSize;
    }

    public async execute(): Promise<void> {
        tabsManager.current.grid_size++;
    }
}

export class DecreaseGridSize implements Command {
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
