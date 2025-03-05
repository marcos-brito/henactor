import type { Command } from ".";
import { configManager, i18n, modalManager } from "$lib";
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

export class OpenPallete implements Command {
    public identifier = "OpenPallete";
    public name = i18n.t("pallete.OpenPallete.name", { ns: "commands" });
    public desc = i18n.t("pallete.OpenPallete.desc", { ns: "commands" });
    public keybinds = ["Control+p"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        modalManager.show("pallete:commands");
    }
}

export class OpenThemePicker implements Command {
    public identifier = "OpenThemePicker";
    public name = i18n.t("settings.OpenThemePicker.name", { ns: "commands" });
    public desc = i18n.t("settings.OpenThemePicker.desc", { ns: "commands" });
    public keybinds = [];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        modalManager.show("pallete:themes");
    }
}

export class OpenSettings implements Command {
    public identifier = "OpenSettings";
    public name = i18n.t("settings.OpenSettings.name", { ns: "commands" });
    public desc = i18n.t("settings.OpenSettings.desc", { ns: "commands" });
    public keybinds = ["Control+o"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        modalManager.show("settings");
    }
}
