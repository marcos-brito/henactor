import { createInstance } from "i18next";
import * as tabsCommands from "./commands/tabs";
import * as fsCommands from "./commands/fs";
import * as navigationCommands from "./commands/navigate";
import { init, options } from "$lib/services/locale.svelte";
import { configPath, userConfig, userThemes } from "$lib/services/config_manager.svelte";
import { ConfigManager, ModalManager, TabsManager, CommandRegister } from "$lib/services";

export const configManager = new ConfigManager(configPath, userConfig, userThemes);
export const commandRegister = new CommandRegister(configManager);
export const modalManager = new ModalManager();
export const i18n = init(createInstance(options, (e, t) => console.log(e, t)));
export const tabsManager = new TabsManager(
    configManager.config.tabs,
    configManager.config.options.default_tab,
);

configManager.watch();
commandRegister
    // Tabs
    .register(new tabsCommands.NewTab())
    .register(new tabsCommands.CloseTab())
    .register(new tabsCommands.NextTab())
    .register(new tabsCommands.PreviousTab())
    .register(new tabsCommands.OpenViewPicker())
    .register(new tabsCommands.OpenSortMethodPicker())
    .register(new tabsCommands.RenameCurrentTab())
    .register(new tabsCommands.OpenDirPicker())
    // Fs
    .register(new fsCommands.Delete())
    .register(new fsCommands.MoveToTrash())
    .register(new fsCommands.Rename())
    .register(new fsCommands.Create())
    // Navigation
    .register(new navigationCommands.OpenPallete())
    .register(new navigationCommands.SaveSettings())
    .register(new navigationCommands.OpenThemePicker())
    .register(new navigationCommands.OpenSettings());
