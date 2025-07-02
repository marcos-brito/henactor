import { commands, type Config, type Theme } from "$lib/bindings";
import { appConfigDir } from "@tauri-apps/api/path";

export let defaultConfig: Config;

commands
    .defaultConfig()
    .then((c) => (defaultConfig = c))
    .catch((e) => console.log(e));

export let configPath: string;
export let userConfig: Config;
export let userThemes: Array<Theme>;
export let initialLang: string;

appConfigDir().then(async (p) => {
    const { config, themes } = await readOrDefault(p);
    configPath = p;
    userConfig = config;
    userThemes = themes;
    initialLang = config.options.lang;
});

export async function readOrDefault(path: string) {
    try {
        return {
            config: await commands.loadConfig(path),
            themes: await commands.findThemes(path),
        };
    } catch (e) {
        return {
            err: e,
            config: defaultConfig,
            themes: [],
        };
    }
}
