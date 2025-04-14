import { createInstance } from "i18next";
import * as tabsCommands from "./commands/tabs";
import * as fsCommands from "./commands/fs";
import * as miscCommands from "./commands/misc";
import * as openCommands from "./commands/open";
import * as explorerCommands from "./commands/explorer";
import { init, options } from "$lib/services/locale.svelte";
import { configPath, userConfig, userThemes } from "$lib/services/config_manager.svelte";
import { ConfigManager, ModalManager, TabsManager, CommandRegister, Opener } from "$lib/services";
import { TaskManager } from "./services/task_manager.svelte";

export const configManager = new ConfigManager(configPath, userConfig, userThemes);
export const commandRegister = new CommandRegister(configManager);
export const modalManager = new ModalManager();
export const i18n = init(createInstance(options, (e, t) => console.log(e, t)));
export const opener = new Opener(configManager);
export const taskManager = new TaskManager();
export const tabsManager = new TabsManager(
    configManager.config.tabs,
    configManager.config.options.default_tab,
);

configManager.watch();
commandRegister
    // Open
    .register(new openCommands.OpenViewPicker())
    .register(new openCommands.OpenSortMethodPicker())
    .register(new openCommands.OpenThemePicker())
    .register(new openCommands.OpenPallete())
    .register(new openCommands.OpenSettings())
    .register(new openCommands.OpenFile())
    .register(new openCommands.OpenDirPicker())
    .register(new openCommands.OpenFileWith())
    .register(new openCommands.OpenFilter())
    // Tabs
    .register(new tabsCommands.NewTab())
    .register(new tabsCommands.CloseTab())
    .register(new tabsCommands.NextTab())
    .register(new tabsCommands.PreviousTab())
    .register(new tabsCommands.RenameCurrentTab())
    // Fs
    .register(new fsCommands.Delete())
    .register(new fsCommands.MoveToTrash())
    .register(new fsCommands.Rename())
    .register(new fsCommands.Create())
    // Explorer
    .register(new explorerCommands.IncreaseGridSize())
    .register(new explorerCommands.DecreaseGridSize())
    // Misc
    .register(new miscCommands.SaveSettings());
