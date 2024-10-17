import { commands, events } from "$lib/bindings";
import * as path from "@tauri-apps/api/path";

async function createConfig() {
    const configPath = await path.appConfigDir()
    let options = $state(await commands.loadConfig(configPath));
    let themes = $state(await commands.findThemes(configPath));
    let currentTheme = $derived(themes.find((t) => t.name == options.current_theme))

    if (options.auto_reload) {
        const watcherId = await commands.watch(configPath);
        events.watchEvent.listen(async (e) => {
            if (e.payload.includes(watcherId.toString())) {
                options = await commands.loadConfig(configPath);
                themes = await commands.findThemes(configPath);
            }
        });
    }


    return {
        configPath,
        get options() { return options },
        get themes() { return themes },
        get currentTheme() { return currentTheme }
    }

}

export const config = await createConfig();
