import { type InitOptions, type i18n } from "i18next";
import * as en from "$lib/locales/en";

export function init(instance: i18n) {
    let i18n = $state<i18n>(instance);

    instance.on("initialized", () => (i18n = instance));
    instance.on("languageChanged", () => (i18n = instance));
    instance.on("added", () => (i18n = instance));
    instance.on("removed", () => (i18n = instance));
    instance.on("loaded", () => (i18n = instance));

    return i18n;
}

export const options: InitOptions = {
    lng: "en",
    fallbackLng: "en",
    debug: true,
    resources: {
        en: {
            settings: en.settings,
            commands: en.commands,
            contextMenu: en.contextMenu,
            modals: en.modals,
            ui: en.ui,
            tooltip: en.tooltip,
        },
    },
};
