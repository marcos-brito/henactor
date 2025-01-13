import { app } from "$lib/app.svelte";
import { TabsManager } from "$lib/tabs.svelte";

export const tabsManager = new TabsManager(app.tabs, app.options.default_tab);
