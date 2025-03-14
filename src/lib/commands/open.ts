import type { Command } from "$lib/services";
import { i18n, modalManager, opener, tabsManager } from "$lib";

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

export class OpenViewPicker implements Command {
    public identifier = "OpenViewPicker";
    public name = i18n.t("tabs.OpenViewPicker.name", { ns: "commands" });
    public desc = i18n.t("tabs.OpenViewPicker.desc", { ns: "commands" });
    public keybinds = ["Control+,"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        modalManager.show("pallete:views");
    }
}

export class OpenSortMethodPicker implements Command {
    public identifier = "OpenSortMethodPicker";
    public name = i18n.t("tabs.OpenSortMethodPicker.name", { ns: "commands" });
    public desc = i18n.t("tabs.OpenSortMethodPicker.desc", { ns: "commands" });
    public keybinds = ["Control+;"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        modalManager.show("pallete:sort");
    }
}

export class OpenDirPicker implements Command {
    public identifier = "OpenDirPicker";
    public name = i18n.t("tabs.OpenDirPicker.name", { ns: "commands" });
    public desc = i18n.t("tabs.OpenDirPicker.desc", { ns: "commands" });
    public keybinds = ["Shift+:"];

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async execute(): Promise<void> {
        modalManager.show("pallete:goto");
    }
}

export class OpenFile implements Command {
    public identifier = "OpenFile";
    public name = i18n.t("explorer.OpenFile.name", { ns: "commands" });
    public desc = i18n.t("explorer.OpenFile.desc", { ns: "commands" });
    public keybinds = ["Control+l"];

    public async canExecute(): Promise<boolean> {
        return tabsManager.current.selected.length > 0;
    }

    public async execute(): Promise<void> {
        for (const file of tabsManager.current.selected) await opener.open(file);
    }
}

export class OpenFileWith implements Command {
    public identifier = "OpenFileWith";
    public name = i18n.t("explorer.OpenFileWith.name", { ns: "commands" });
    public desc = i18n.t("explorer.OpenFileWith.desc", { ns: "commands" });
    public keybinds = ["Control+Shift+L"];

    public async canExecute(): Promise<boolean> {
        return tabsManager.current.selected.length > 0;
    }

    public async execute(): Promise<void> {
        modalManager.show("pallete:openers");
    }
}
