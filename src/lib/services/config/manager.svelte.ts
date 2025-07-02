import { type UnlistenFn } from "@tauri-apps/api/event";
import { commands, events, type Config, type Theme } from "$lib/bindings";
import { injectable } from "inversify";
import { defaultConfig, readOrDefault } from "./load";

@injectable()
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
