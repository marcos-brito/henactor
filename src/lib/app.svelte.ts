import { commands, events, type Config, type Error, type Tab, type View } from "$lib/bindings";
import * as pathApi from "@tauri-apps/api/path";
import { _ } from "svelte-i18n";
import { toast } from "svelte-sonner";
import { fromStore } from "svelte/store";

export let app: Awaited<ReturnType<typeof createAppStateManager>>;
export let loadingError: Error | null = null;

readFromFs().then(async (config) => {
    app = await createAppStateManager(config);
}).catch(async (error) => {
    const defaultConfig = await commands.defaultConfig();
    app = await createAppStateManager(defaultConfig)
    loadingError = error
})

async function readFromFs(): Promise<Config> {
    const path = await pathApi.appConfigDir()
    return await commands.loadConfig(path);
}

async function createAppStateManager(config: Config) {
    const configPath = await pathApi.appConfigDir()
    let app = $state(config);
    let themes = $state(await commands.findThemes(configPath))
    let currentTheme = $derived(themes.find((t) => t.name == app.options.current_theme))
    async function save(): Promise<void> {
        await commands.saveConfig(path, config);
    }

    async function watch() {
        if (configWatcher) return;
        configWatcher = await commands.watch(path);
        // this listener will always exist, but once the fs watcher is removed it will never trigger again
        events.watchEvent.listen(async (e) => {
            if (configWatcher && e.payload.includes(configWatcher.toString())) {
                config = await commands.loadConfig(path);
            }
        });
    }

    async function unwatch(): Promise<void> {
        //todo!
        // commands.removeWatcher
    }

    return {
        get pins() { return app.pins },
        get options() { return app.options },
        get themes() { return themes },
        get keybinds() { return app.keybinds },
        tabs: await createTabsManager(app.tabs),
        get currentTheme() { return currentTheme },
        watch,
        unwatch,
        save,
    }

}

export async function createTabsManager(tabs: Array<Tab>) {
    let currentIdx = $state(tabs.length > 0 ? tabs.length - 1 : 0);
    let current = $derived(tabs.at(currentIdx));

    const defaultTab = {
        name: "New",
        path: await pathApi.homeDir(),
        view: "Grid" as View,
        query: "",
        grid_size: 4,
    };

    function add(tab: Tab = defaultTab): void {
        tabs.push(tab);
        currentIdx = tabs.length - 1
    }

    function duplicate(idx: number): void {
        tabs.splice(idx, 0, tabs[idx]);
        currentIdx = idx + 1
    }
    function close(idx: number): void {
        tabs.splice(idx, 1);
        if (currentIdx > 0) currentIdx = idx - 1;
    }

    function closeAhead(idx: number): void {
        tabs.splice(idx + 1, tabs.length);
        currentIdx = idx;
    }

    function closeBehind(idx: number): void {
        tabs.splice(0, idx);
        currentIdx -= idx;
    }

    function closeAllExcept(idx: number): void {
        closeAhead(idx);
        closeBehind(idx);
        currentIdx = 0;
    }

    function setCurrentPath(path: string) {
        tabs[currentIdx].path = path
    }


    return {
        get _() { return tabs },
        get current() { return current },
        get currentIdx() { return currentIdx },
        set currentIdx(idx: number) { currentIdx = idx },
        defaultTab,
        setCurrentPath,
        add,
        duplicate,
        close,
        closeAhead,
        closeBehind,
        closeAllExcept,
    }

}
