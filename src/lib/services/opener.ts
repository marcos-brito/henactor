import { commands } from "$lib/bindings";
import mime from "mime";
import type { ConfigManager } from "./config_manager.svelte";

export class Opener {
    constructor(private configManager: ConfigManager) {}

    public async open(path: string): Promise<void> {
        const opener = this.findOpener(path);

        if (opener) return await this.open_with(path, opener);
        await commands.open(path);
    }

    public new(pattern: string, app: string): void {
        this.configManager.config.openers[pattern] = app;
    }

    public remove(pattern: string): void {
        delete this.configManager.config.openers[pattern];
    }

    private findOpener(path: string): string | null {
        const mimeType = mime.getType(path);

        if (mimeType && Object.hasOwn(this.configManager.config.openers, mimeType))
            return this.configManager.config.openers[mimeType];

        for (const [pattern, opener] of Object.entries(this.configManager.config.openers))
            if (pattern.match(path)) return opener;

        return null;
    }

    public async openersOf(path: string): Promise<Array<string>> {
        return [];
    }

    public async open_with(path: string, app: string): Promise<void> {
        await commands.openWith(path, app);
    }
}
