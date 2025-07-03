import type { Tab as InternalTab } from "$lib/bindings";
import { inject, injectable } from "inversify";
import { ConfigManager, Executor } from ".";


class Tab {
    private tab: InternalTab;

    constructor(
        tab: InternalTab,
        public executor: Executor,
        public observer: Observer,
    ) {
        this.tab = $state(tab);
    }

    public get name() {
        return this.tab.name;
    }

    public set name(name: string) {
        this.set("name", name);
    }

    public get path() {
        return this.tab.path;
    }

    public set path(path: string) {
        this.set("path", path);
    }

    public get query() {
        return this.tab.query;
    }

    public set query(query: string) {
        this.set("query", query);
    }

    private set<K extends keyof InternalTab>(prop: K, value: InternalTab[K]) {
        this.tab[prop] = value;
    }
}

@injectable()
export class TabsManager {
    #currentIdx = $state(0);
    readonly defaultTab: InternalTab;
    readonly tabs = $state<Array<Tab>>([]);
    readonly current = $derived(this.tabs[this.currentIdx]);

    constructor(
        @inject(ConfigManager) private configManager: ConfigManager,
        @inject(Observer) public observer: Observer,
    ) {
        this.defaultTab = this.configManager.config.options.default_tab;
        this.tabs = this.configManager.config.tabs.map(
            (tab) => new Tab(tab, new Executor(), observer),
        );

        if (this.tabs.length == 0) this.add();
    }

    public get currentIdx(): number {
        return this.#currentIdx;
    }

    public set currentIdx(idx: number) {
        if (idx < 0) this.#currentIdx = 0;
        if (idx > this.tabs.length) this.#currentIdx = this.tabs.length - 1;

        this.#currentIdx = idx;
    }

    public next(): void {
        this.currentIdx += 1;
    }

    public previous(): void {
        this.currentIdx -= 1;
    }

    public add(internalTab: InternalTab = this.defaultTab): void {
        const tab = new Tab(internalTab, new Executor(), this.observer);

        this.tabs.push(tab);
        this.currentIdx = this.tabs.length;
    }

    public duplicate(idx: number): void {
        this.tabs.splice(idx, 0, this.tabs[idx]);
        this.currentIdx += 1;
    }

    public close(idx: number): void {
        this.tabs.splice(idx, 1);
        this.currentIdx -= 1;
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
}
