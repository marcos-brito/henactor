import { ModalManager, TabsManager } from "$lib/services";
import type { i18n as i18nT } from "i18next";
import { commands } from "$lib/bindings";
import type { StatusProvider } from "./registry";
import { collect } from "$lib/collector";
import { inject } from "inversify";
import { type i18n } from "i18next";
import type { CoreEvents } from "$lib/services/observer";

@collect("status")
export class SelectedItems implements StatusProvider {
    public name = "selectedItems";
    public events: Array<keyof CoreEvents> = ["tab:changed"];

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
    ) {}

    public status(): string {
        return this.i18n.t("statusBar.selectedItems", {
            ns: "ui",
            count: this.tabsManager.current.selected.length,
        });
    }

    public isVisible(): boolean {
        return this.tabsManager.current.selected.length > 0;
    }

    public onClick(): void {
        this.tabsManager.current.selected = [];
    }
}

@collect("status")
export class StagedActions implements StatusProvider {
    public name = "stagedActions";
    public events: Array<keyof CoreEvents> = ["tab:changed"];

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
        @inject(ModalManager)
        private modalManager: ModalManager,
    ) {}

    public status(): string {
        return this.i18n.t("statusBar.stagedActions", {
            ns: "ui",
            count: this.tabsManager.current.executor.staged.length,
        });
    }

    public isVisible(): boolean {
        return this.tabsManager.current.executor.staged.length > 0;
    }

    public onClick(): void {
        this.modalManager.show("commit");
    }
}

@collect("status")
export class DeepSearch implements StatusProvider {
    public name = "deepSearch";
    public events: Array<keyof CoreEvents> = ["tab:changed"];

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
    ) {}

    public status(): string {
        return this.i18n.t("statusBar.searchingBy", {
            ns: "ui",
            query: this.tabsManager.current.deepSearch,
        });
    }

    public isVisible(): boolean {
        return this.tabsManager.current.deepSearch.trim() != "";
    }

    public onClick(): void {
        this.tabsManager.current.deepSearch = "";
    }
}

@collect("status")
export class QuickSearch implements StatusProvider {
    public name = "quickSearch";
    public events: Array<keyof CoreEvents> = ["tab:changed"];

    constructor(
        @inject("i18n")
        private i18n: i18n,
        @inject(TabsManager)
        private tabsManager: TabsManager,
    ) {}

    public status(): string {
        return this.i18n.t("statusBar.searchingBy", {
            ns: "ui",
            query: this.tabsManager.current.quickSearch,
        });
    }

    public isVisible(): boolean {
        return this.tabsManager.current.quickSearch.trim() != "";
    }

    public onClick(): void {
        this.tabsManager.current.quickSearch = "";
    }
}

export class Items implements StatusProvider {
    public name = "items";
    public events: Array<keyof CoreEvents> = ["tab:changed"];

    constructor(
        private i18n: i18nT,
        private tabsManager: TabsManager,
    ) {}

    public async status(): Promise<string> {
        const entries = await commands.list(this.tabsManager.current.path);

        return this.i18n.t("statusBar.items", { ns: "ui", count: entries.length });
    }

    public isVisible(): boolean {
        return true;
    }
}
