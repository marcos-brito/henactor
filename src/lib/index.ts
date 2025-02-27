import { app } from "$lib/app.svelte";
import { TabsManager } from "$lib/tabs.svelte";
import { createInstance } from "i18next";
import { init, options } from "./locale2.svelte";

export const tabsManager = new TabsManager(app.tabs, app.options.default_tab);
export const i18n = init(createInstance(options, (e, t) => console.log(e, t)));
