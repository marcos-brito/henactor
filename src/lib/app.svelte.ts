import { commands, events, type Config, type Error, type Options, type Tab } from "$lib/bindings";
import { type UnlistenFn } from "@tauri-apps/api/event";
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
    let unlisten = $state<UnlistenFn | null>(null)
    const watcher = await commands.watch(configPath);

    async function save(): Promise<void> {
        unwatch();
        await commands.saveConfig(configPath, app);
        if (app.options.auto_reload) await watch()
    }

    async function watch(): Promise<void> {
        const t = fromStore(_);
        if (unlisten || !watcher) return;
        unlisten = await events.watchEvent.listen(async (e) => {
            if (e.payload.includes(watcher.toString())) {
                try {
                    const [newConfig, newThemes] = await Promise.all([
                        commands.loadConfig(configPath),
                        commands.findThemes(configPath)
                    ])
                    app = newConfig
                    themes = newThemes
                    toast.info(t.current("messages.reload_config.title"))
                } catch (e) {
                    toast.error(t.current("messages.error.reload_config.title"))
                }
            }
        });
    }

    function unwatch(): void {
        if (unlisten) {
            unlisten();
            unlisten = null;
        }
    }

    return {
        get pins() { return app.pins },
        get options() { return app.options },
        get themes() { return themes },
        get keybinds() { return app.keybinds },
        tabs: createTabsManager(app.tabs, app.options),
        get currentTheme() { return currentTheme },
        watch,
        unwatch,
        save,
    }

}

// FIX: This is not reacting to changes
export function createTabsManager(tabs: Array<Tab>, options: Options) {
    let currentIdx = $state(0);
    let current = $derived(tabs[currentIdx]);

    if (tabs.length == 0) tabs.push({ ...options.default_tab })

    function add(tab: Tab = { ...options.default_tab }): void {
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
        set currentIdx(idx: number) { if (idx < 0 || idx >= tabs.length) return; currentIdx = idx },
        setCurrentPath,
        add,
        duplicate,
        close,
        closeAhead,
        closeBehind,
        closeAllExcept,
    }

}
