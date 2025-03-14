import type { Command } from "$lib/services";
import { configManager, i18n } from "$lib";
import { commands } from "$lib/bindings";

export class SaveSettings implements Command {
    public identifier = "SaveSettings";
    public name = i18n.t("settings.SaveSettings.name", { ns: "commands" });
    public desc = i18n.t("settings.SaveSettings.desc", { ns: "commands" });
    public keybinds = ["Control+s"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        await commands.saveConfig(configManager.path, configManager.config);
    }
}
