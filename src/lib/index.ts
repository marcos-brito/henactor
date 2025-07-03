import { createInstance, type i18n as i18nT } from "i18next";
import { init, options } from "$lib/services/locale.svelte";
import { configPath, userConfig, userThemes } from "$lib/services/config/load";
import * as services from "$lib/services";
import { Container } from "inversify";
import { allOf } from "$lib/collector";

export const container = new Container();

container
    .bind(services.ConfigManager)
    .toConstantValue(new services.ConfigManager(configPath, userConfig, userThemes));

container
    .bind<i18nT>("i18n")
    .toConstantValue(init(createInstance(options, (e, t) => console.log(e, t))));

container.bind(services.ModalManager).toSelf().inSingletonScope();
container.bind(services.TabsManager).toSelf().inSingletonScope();
container.bind(services.Opener).toSelf().inSingletonScope();
container.bind(services.CommandRegister).toSelf().inSingletonScope();
container.bind(services.StatusRegistry).toSelf().inSingletonScope();
container.bind(services.TaskManager).toSelf().inSingletonScope();

container.get(services.CommandRegister).registerMany(
    ...allOf("command").map((cmd) => {
        container.bind(cmd).toSelf();
        return container.get(cmd);
    }),
);

container.get(services.StatusRegistry).registerMany(
    ...allOf("status").map((status) => {
        container.bind(status).toSelf();
        return container.get(status);
    }),
);

export const configManager = container.get(services.ConfigManager);
export const commandRegister = container.get(services.CommandRegister);
export const modalManager = container.get(services.ModalManager);
export const i18n = container.get<i18nT>("i18n");
export const opener = container.get(services.Opener);
export const tabsManager = container.get(services.TabsManager);
export const taskManager = container.get(services.TaskManager);
export const statusRegistry = container.get(services.StatusRegistry);

configManager.watch();
