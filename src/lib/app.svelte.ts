import { commands, events, type Tab, type View } from "$lib/bindings";
import * as pathApi from "@tauri-apps/api/path";

export let app: Awaited<ReturnType<typeof createAppStateManager>>;
createAppStateManager().then((c) => app = c).catch(async (e) => {
    console.log(`error loading config: ${e}`);
});

async function createAppStateManager() {
    const path = await pathApi.appConfigDir()
    let config = $state(await commands.loadConfig(path));
    let configWatcher = $state<number | null>(null);
    let currentTheme = $derived(config.themes.find((t) => t.name == config.options.current_theme))

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
        get pins() { return config.pins },
        get options() { return config.options },
        get themes() { return config.themes },
        get keybinds() { return config.keybinds },
        tabs: await createTabsManager(config.tabs),
        currentTheme,
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
