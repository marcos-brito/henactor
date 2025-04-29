import type { Tab } from "$lib/bindings";
import { inject, injectable } from "inversify";
import { ConfigManager, Executor } from ".";

type InternalTab = Tab & {
    executor: Executor;
};

@injectable()
export class TabsManager {
    public currentIdx = $state(0);
    public defaultTab: Tab;
    public tabs = $state<Array<InternalTab>>([]);
    public current = $derived(this.tabs[this.currentIdx]);

    constructor(@inject(ConfigManager) private configManager: ConfigManager) {
        this.defaultTab = this.configManager.config.options.default_tab;
        this.tabs = this.configManager.config.tabs.map((tab) => {
            return { ...tab, executor: new Executor() };
        });

        if (this.tabs.length == 0) this.add();
    }

    public add(tab: Tab = { ...this.defaultTab }): void {
        this.tabs.push({ ...tab, executor: new Executor() });
        this.currentIdx = this.tabs.length - 1;
    }

    public next(): void {
        if (this.currentIdx < this.tabs.length) this.currentIdx++;
    }

    public previous(): void {
        if (this.currentIdx > 0) this.currentIdx--;
    }

    public duplicate(idx: number): void {
        this.tabs.splice(idx, 0, this.tabs[idx]);
        this.currentIdx = idx + 1;
    }

    public close(idx: number): void {
        this.tabs.splice(idx, 1);
        if (this.currentIdx > 0) this.currentIdx = idx - 1;
    }

    public closeAhead(idx: number): void {
        this.tabs.splice(idx + 1, this.tabs.length);
        this.currentIdx = idx;
    }

    public closeBehind(idx: number): void {
        this.tabs.splice(0, idx);
        this.currentIdx = 0;
    }

    public closeAllExcept(idx: number): void {
        this.closeAhead(idx);
        this.closeBehind(idx);
        this.currentIdx = 0;
    }

    public setCurrentPath(path: string) {
        this.tabs[this.currentIdx].path = path;
    }
}
