import { TabsManager } from "$lib/tabs.svelte";
import { createInstance } from "i18next";
import { Create, Delete, NewTab, Register, Rename } from "./commands";
import { CloseTab, NextTab, PreviousTab } from "./commands/tabs";
import { init, options } from "./locale.svelte";
import { ConfigManager, configPath, userConfig, userThemes } from "./config.svelte";
import { ModalManager } from "./modal_manager";

export const configManager = new ConfigManager(configPath, userConfig, userThemes);
export const tabsManager = new TabsManager(configManager.config.tabs, configManager.config.options.default_tab);
export const commandRegister = new Register();
export const modalManager = new ModalManager();
export const i18n = init(createInstance(options, (e, t) => console.log(e, t)));

console.log(configManager, tabsManager, commandRegister, i18n)
console.log(configManager.config)

configManager.watch()
commandRegister
    // Fs
    .register(new Delete())
    .register(new Create())
    .register(new Rename())
    // Tabs 
    .register(new NewTab())
    .register(new CloseTab())
    .register(new NextTab())
    .register(new PreviousTab());
