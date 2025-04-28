import type { TabsManager } from "$lib/services";
import type { i18n as i18nT } from "i18next";
import { commands } from "$lib/bindings";
import { i18n, modalManager, tabsManager } from "$lib";
import type { StatusProvider } from "./status_registry.svelte";

export class SelectedItems implements StatusProvider {
    public name = "selected";
    public status = $derived.by(() => {
        if (tabsManager.current.selected.length > 0)
            return i18n.t("statusBar.selectedItems", {
                ns: "ui",
                count: tabsManager.current.selected.length,
            });

        return "";
    });

    public onClick(): void {
        tabsManager.current.selected = [];
    }
}

export class StagedActions implements StatusProvider {
    public name = "staged";
    public status = $derived.by(() => {
        if (tabsManager.current.executor.staged.length > 0)
            return i18n.t("statusBar.stagedActions", {
                ns: "ui",
                count: tabsManager.current.executor.staged.length,
            });

        return "";
    });

    public onClick(): void {
        modalManager.show("commit");
    }
}

export class DeepSearch implements StatusProvider {
    public name = "DeepSearch";
    public status = $derived.by(() => {
        if (tabsManager.current.query)
            return i18n.t("statusBar.searchingBy", {
                ns: "ui",
                query: tabsManager.current.query,
            });

        return "";
    });

    public onClick(): void {
        tabsManager.current.query = "";
    }
}

export class QuickSearch implements StatusProvider {
    public name = "QuickSearch";
    public status = $derived.by(() => {
        if (tabsManager.current.filter)
            return i18n.t("statusBar.searchingBy", {
                ns: "ui",
                query: tabsManager.current.filter,
            });

        return "";
    });

    public onClick(): void {
        tabsManager.current.filter = "";
    }
}

export class Items implements StatusProvider {
    public name = "items";
    public status = $state("0");

    constructor(
        private i18n: i18nT,
        private tabsManager: TabsManager,
    ) {
        this.refresh();

        setInterval(() => this.refresh(), 1000);
    }

    public async refresh(): Promise<void> {
        const entries = await commands.list(this.tabsManager.current.path);
        this.status = this.i18n.t("statusBar.items", { ns: "ui", count: entries.length });
    }
}
