import { TabsManager } from "$lib/tabs.svelte";
import { createInstance } from "i18next";
import { Register } from "./commands";
import * as tabsCommands from "./commands/tabs";
import * as fsCommands from "./commands/fs";
import * as navigationCommands from "./commands/navigate";
import { init, options } from "./locale.svelte";
import { ConfigManager, configPath, userConfig, userThemes } from "./config.svelte";
import { ModalManager } from "./modal_manager";

export const configManager = new ConfigManager(configPath, userConfig, userThemes);
export const tabsManager = new TabsManager(
    configManager.config.tabs,
    configManager.config.options.default_tab,
);
export const commandRegister = new Register(configManager);
export const modalManager = new ModalManager();
export const i18n = init(createInstance(options, (e, t) => console.log(e, t)));

configManager.watch();
commandRegister
    // Tabs
    .register(new tabsCommands.NewTab())
    .register(new tabsCommands.CloseTab())
    .register(new tabsCommands.NextTab())
    .register(new tabsCommands.PreviousTab())
    // Fs
    .register(new fsCommands.Delete())
    .register(new fsCommands.Rename())
    .register(new fsCommands.Create())
    // Navigation
    .register(new navigationCommands.OpenPallete())
    .register(new navigationCommands.SaveSettings())
    .register(new navigationCommands.OpenThemePicker())
    .register(new navigationCommands.OpenSettings());
