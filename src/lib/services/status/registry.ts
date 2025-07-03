import type { CoreEvents } from "$lib/services/observer";
import { injectable } from "inversify";
import { SvelteMap } from "svelte/reactivity";

export interface StatusProvider {
    name: string;
    refreshRate?: number;
    events?: Array<keyof CoreEvents>;
    status(): string | Promise<string>;
    isVisible(): boolean;
    onClick?: () => void;
}

@injectable()
export class StatusRegistry {
    private allSelector = "*";
    readonly items = new SvelteMap<string, StatusProvider>();

    public registerMany(...providers: Array<StatusProvider>): void {
        for (const provider of providers) this.register(provider);
    }

    public register(provider: StatusProvider): StatusRegistry {
        this.items.set(provider.name, provider);
        return this;
    }

    public find(...names: Array<string>): Array<StatusProvider> {
        const selectorIndex = names.indexOf(this.allSelector);
        const providers = names
            .map((name) => this.items.get(name))
            .filter((provider) => provider != undefined);

        if (selectorIndex == -1) return providers;
        return this.expand(providers, selectorIndex);
    }

    private expand(providers: Array<StatusProvider>, index: number): Array<StatusProvider> {
        const missing = this.items.values().filter((provider) => !providers.includes(provider));
        providers.splice(index, 0, ...missing);
        return providers;
    }
}
