import { createInstance, type i18n as i18nT } from "i18next";
import * as tabsCommands from "./commands/tabs";
import * as fsCommands from "./commands/fs";
import * as miscCommands from "./commands/misc";
import * as openCommands from "./commands/open";
import * as explorerCommands from "./commands/explorer";
import { init, options } from "$lib/services/locale.svelte";
import { configPath, userConfig, userThemes } from "$lib/services/config_manager.svelte";
import { ConfigManager, ModalManager, TabsManager, CommandRegister, Opener } from "$lib/services";
import { TaskManager } from "./services/task_manager.svelte";
import { maxGridSize, minGridSize } from "./utils";
import {
    StatusRegistry,
    Items,
    DeepSearch,
    StagedActions,
    QuickSearch,
    SelectedItems,
} from "./services/status";
import { Container } from "inversify";
import { registeredCommands } from "./config";

export const container = new Container();

container
    .bind(ConfigManager)
    .toConstantValue(new ConfigManager(configPath, userConfig, userThemes));

container
    .bind<i18nT>("i18n")
    .toConstantValue(init(createInstance(options, (e, t) => console.log(e, t))));

container.bind(CommandRegister).toSelf().inSingletonScope();
container.bind(ModalManager).toSelf().inSingletonScope();
container.bind(TabsManager).toSelf().inSingletonScope();

container.get(CommandRegister).registerMany(
    ...registeredCommands().map((cmd) => {
        container.bind(cmd).toSelf();
        return container.get(cmd);
    }),
);

export const configManager = new ConfigManager(configPath, userConfig, userThemes);
export const commandRegister = new CommandRegister(configManager);
export const modalManager = new ModalManager();
export const i18n = init(createInstance(options, (e, t) => console.log(e, t)));
export const opener = new Opener(configManager);
export const taskManager = new TaskManager();
export const statusRegistry = new StatusRegistry();
export const tabsManager = new TabsManager(configManager);

statusRegistry.add(new Items(i18n, tabsManager));
statusRegistry.add(new StagedActions());
statusRegistry.add(new SelectedItems());
statusRegistry.add(new DeepSearch());
statusRegistry.add(new QuickSearch());

configManager.watch();
commandRegister
    // Open
    .register(new openCommands.OpenPallete(i18n, modalManager))
    .register(new openCommands.OpenSettings(i18n, modalManager))
    .register(new openCommands.OpenThemePicker(i18n, modalManager))
    .register(new openCommands.OpenViewPicker(i18n, modalManager))
    .register(new openCommands.OpenSortMethodPicker(i18n, modalManager))
    .register(new openCommands.OpenDirPicker(i18n, modalManager))
    .register(new openCommands.OpenFile(i18n, modalManager, tabsManager, opener))
    .register(new openCommands.OpenFileWith(i18n, modalManager, tabsManager))
    .register(new openCommands.OpenFilter(i18n, modalManager))
    // Tabs
    .register(new tabsCommands.NewTab(i18n, tabsManager, modalManager))
    .register(new tabsCommands.CloseTab(i18n, tabsManager, modalManager))
    .register(new tabsCommands.NextTab(i18n, tabsManager, modalManager))
    .register(new tabsCommands.PreviousTab(i18n, tabsManager, modalManager))
    .register(new tabsCommands.RenameCurrentTab(i18n, tabsManager, modalManager))
    .register(new tabsCommands.Commit(i18n, tabsManager, modalManager))
    // Fs
    .register(new fsCommands.Delete(i18n, modalManager, tabsManager))
    .register(new fsCommands.MoveToTrash(i18n, modalManager, tabsManager))
    .register(new fsCommands.Rename(i18n, modalManager, tabsManager))
    .register(new fsCommands.Create(i18n, modalManager, tabsManager, configManager))
    // Explorer
    .register(new explorerCommands.IncreaseGridSize(i18n, tabsManager, modalManager, maxGridSize))
    .register(new explorerCommands.DecreaseGridSize(i18n, tabsManager, modalManager, minGridSize))
    // Misc
    .register(new miscCommands.SaveSettings(i18n, configManager));
