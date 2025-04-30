import { type UnlistenFn } from "@tauri-apps/api/event";
import { commands, events, type Config, type Theme } from "$lib/bindings";
import { appConfigDir } from "@tauri-apps/api/path";

let defaultConfig: Config;
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

async function readOrDefault(path: string) {
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

export class ConfigManager {
    public path: string;
    public config = $state<Config>(defaultConfig);
    public themes = $state<Array<Theme>>([]);
    public currentTheme = $derived(
        this.themes.find((t) => t.name == this.config.options.current_theme),
    );
    private unlisten: UnlistenFn | null = null;

    constructor(path: string, config: Config, themes: Array<Theme>) {
        this.path = path;
        this.config = config;
        this.themes = themes;
    }

    public async save(): Promise<void> {
        await this.unwatch();
        await commands.saveConfig(this.path, this.config);
        await this.watch();
    }

    public async watch(): Promise<void> {
        if (!this.unlisten) {
            await commands.watch(this.path, true);
            this.unlisten = await events.watchEvent.listen(async (e) => {
                if (e.payload == this.path) {
                    const { config, themes } = await readOrDefault(this.path);
                    this.config = config;
                    this.themes = themes;
                }
            });
        }
    }

    public async unwatch(): Promise<void> {
        if (this.unlisten) {
            await commands.unwatch(this.path);
            this.unlisten();
            this.unlisten = null;
        }
    }
}
