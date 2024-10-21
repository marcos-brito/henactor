import { commands, events } from "$lib/bindings";
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
        get tabs() { return config.tabs },
        // tabs: await createTabsManager(config.tabs),
        currentTheme,
        watch,
        unwatch,
        save,
    }

}
