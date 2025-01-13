import { commands, events, type Config, type Error } from "$lib/bindings";
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
        get tabs() { return app.tabs },
        get currentTheme() { return currentTheme },
        watch,
        unwatch,
        save,
    }

}
