import type { Tab } from "$lib/bindings";
import { FsManager } from "$lib/fs";

export class TabsManager {
    public currentIdx = $state(0);
    public defaultTab: Tab;
    public tabs = $state<Array<Tab & { fs: FsManager }>>([]);
    public current = $derived(this.tabs[this.currentIdx]);

    constructor(tabs: Array<Tab>, defaultTab: Tab) {
        this.tabs = tabs.map((tab) => {
            return { ...tab, fs: new FsManager() };
        });
        this.defaultTab = defaultTab;
        if (tabs.length == 0) this.add();
    }

    public add(tab: Tab = { ...this.defaultTab }): void {
        this.tabs.push({ ...tab, fs: new FsManager() });
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