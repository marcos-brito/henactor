import { getMatches } from "@tauri-apps/plugin-cli";
import { commands, events, type Config as RawConfig, type Theme } from "../bindings";
import { writable, type Writable } from "svelte/store";
import * as path from "@tauri-apps/api/path";

export type Config = {
    config: Writable<RawConfig>;
    themes: Writable<Array<Theme>>;
};

export class ConfigBuilder {
    private configPath: string;
    private rawConfig: RawConfig | undefined;
    private config: Writable<RawConfig> | undefined;
    private themes: Writable<Array<Theme>> | undefined;

    constructor(configPath: string) {
        this.configPath = configPath;
    }

    public async init(): Promise<ConfigBuilder> {
        const config = await commands.loadConfig(this.configPath);
        const themes = await commands.findThemes(this.configPath);

        this.rawConfig = config;
        this.config = writable(config);
        this.themes = writable(themes);

        return this;
    }

    public async watch(): Promise<ConfigBuilder> {
        await commands.watch(this.configPath);
        events.watchEvent.listen(async () => {
            const newConfig = await commands.loadConfig(this.configPath);
            const newThemes = await commands.findThemes(this.configPath);

            this.config!.set(newConfig);
            this.themes!.set(newThemes);
        });

        return this;
    }

    public async saveOnChange(): Promise<ConfigBuilder> {
        this.config!.subscribe(async (config) => {
            await commands.saveConfig(this.configPath, config);
        });

        return this;
    }

    public async makeDefault(): Promise<Config> {
        await this.init();

        if (this.rawConfig!.auto_reload) await this.watch();
        if (this.rawConfig!.save_on_change) await this.saveOnChange();

        return {
            config: this.config!,
            themes: this.themes!,
        };
    }
}

export async function getConfigPath(): Promise<string> {
    const matches = await getMatches();
    return (matches.args.config_dir.value as string) || (await path.appConfigDir());
}

const configPath = await getConfigPath();
const stores = await new ConfigBuilder(configPath).makeDefault();

export const config = stores.config;
export const themes = stores.themes;
