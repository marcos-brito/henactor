import { Opener, TabsManager, ModalManager } from "$lib/services";
import type { i18n } from "i18next";
import { inject } from "inversify";
import { command, type Command } from "./commands_registry.svelte";

@command
export class OpenPallete implements Command {
    public name: string;
    public desc: string;
    public identifier = "OpenPallete";
    public keybinds = ["Control+p"];
    public visible = false;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("pallete.OpenPallete.name", { ns: "commands" });
        this.desc = this.i18n.t("pallete.OpenPallete.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("pallete:commands");
    }
}

@command
export class OpenSettings implements Command {
    public name: string;
    public desc: string;
    public identifier = "OpenSettings";
    public keybinds = ["Control+o"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("settings.OpenSettings.name", { ns: "commands" });
        this.desc = this.i18n.t("settings.OpenSettings.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return this.modalManager.allClosedExcept("pallete:commands");
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("settings");
    }
}

@command
export class OpenThemePicker implements Command {
    public name: string;
    public desc: string;
    public identifier = "OpenThemePicker";
    public keybinds = [];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("settings.OpenThemePicker.name", { ns: "commands" });
        this.desc = this.i18n.t("settings.OpenThemePicker.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("pallete:themes");
    }
}

@command
export class OpenViewPicker implements Command {
    public name: string;
    public desc: string;
    public identifier = "OpenViewPicker";
    public keybinds = ["Control+,"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.OpenViewPicker.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.OpenViewPicker.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("pallete:views");
    }
}

@command
export class OpenSortMethodPicker implements Command {
    public name: string;
    public desc: string;
    public identifier = "OpenSortMethodPicker";
    public keybinds = ["Control+;"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.OpenSortMethodPicker.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.OpenSortMethodPicker.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("pallete:sort");
    }
}

@command
export class OpenDirPicker implements Command {
    public name: string;
    public desc: string;
    public identifier = "OpenDirPicker";
    public keybinds = ["Shift+:"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.OpenDirPicker.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.OpenDirPicker.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("pallete:goto");
    }
}

@command
export class OpenFile implements Command {
    public name: string;
    public desc: string;
    public identifier = "OpenFile";
    public keybinds = ["Control+l"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
        @inject(TabsManager)
        private tabsManager: TabsManager,
        @inject(Opener)
        private opener: Opener,
    ) {
        this.name = this.i18n.t("explorer.OpenFile.name", { ns: "commands" });
        this.desc = this.i18n.t("explorer.OpenFile.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return this.tabsManager.current.selected.length > 0;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        for (const file of this.tabsManager.current.selected) await this.opener.open(file);
    }
}

@command
export class OpenFileWith implements Command {
    public name: string;
    public desc: string;
    public identifier = "OpenFileWith";
    public keybinds = ["Control+Shift+L"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
        @inject(TabsManager)
        private tabsManager: TabsManager,
    ) {
        this.name = this.i18n.t("explorer.OpenFileWith.name", { ns: "commands" });
        this.desc = this.i18n.t("explorer.OpenFileWith.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return this.tabsManager.current.selected.length > 0;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("pallete:openers");
    }
}

@command
export class OpenFilter implements Command {
    public name: string;
    public desc: string;
    public identifier = "OpenFilter";
    public keybinds = ["/"];
    public visible = true;

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(ModalManager)
        private modalManager: ModalManager,
    ) {
        this.name = this.i18n.t("tabs.OpenFilter.name", { ns: "commands" });
        this.desc = this.i18n.t("tabs.OpenFilter.desc", { ns: "commands" });
    }

    public async canExecute(): Promise<boolean> {
        return true;
    }

    public async canTrigger(): Promise<boolean> {
        return this.modalManager.allClosed();
    }

    public async execute(): Promise<void> {
        this.modalManager.show("filterBox");
    }
}
