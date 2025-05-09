import { createInstance, type i18n as i18nT } from "i18next";
import { init, options } from "$lib/services/locale.svelte";
import { configPath, userConfig, userThemes } from "$lib/services/config_manager.svelte";
import { ConfigManager, ModalManager, TabsManager, CommandRegister, Opener } from "$lib/services";
import { allCommands } from "$lib/services/command";
import { TaskManager } from "./services/task_manager.svelte";
import {
    StatusRegistry,
    Items,
    DeepSearch,
    StagedActions,
    QuickSearch,
    SelectedItems,
} from "./services/status";
import { Container } from "inversify";

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
container.bind(Opener).toSelf().inSingletonScope();

container.get(CommandRegister).registerMany(
    ...allCommands().map((cmd) => {
        container.bind(cmd).toSelf();
        return container.get(cmd);
    }),
);

export const configManager = container.get(ConfigManager);
export const commandRegister = container.get(CommandRegister);
export const modalManager = container.get(ModalManager);
export const i18n = container.get<i18nT>("i18n");
export const opener = container.get(Opener);
export const tabsManager = container.get(TabsManager);
export const taskManager = new TaskManager();
export const statusRegistry = new StatusRegistry();

statusRegistry.add(new Items(i18n, tabsManager));
statusRegistry.add(new StagedActions());
statusRegistry.add(new SelectedItems());
statusRegistry.add(new DeepSearch());
statusRegistry.add(new QuickSearch());

configManager.watch();
