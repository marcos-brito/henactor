import { ConfigManager } from "$lib/services";
import type { i18n } from "i18next";
import { command, type Command } from "./commands_registry.svelte";
import { inject } from "inversify";

@command
export class SaveSettings implements Command {
    public name: string;
    public desc: string;
    public identifier = "SaveSettings";
    public keybinds = ["Control+Shift+S"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ConfigManager)
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
