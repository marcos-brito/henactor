import type { Command, ConfigManager } from "$lib/services";
import type { i18n } from "i18next";

export class SaveSettings implements Command {
    public name: string;
    public desc: string;
    public identifier = "SaveSettings";
    public keybinds = ["Control+s"];

    constructor(
        private i18n: i18n,
        private configManager: ConfigManager,
    ) {
        this.name = this.i18n.t("settings.SaveSettings.name", { ns: "commands" });
        this.desc = this.i18n.t("settings.SaveSettings.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        await this.configManager.save();
    }
}
