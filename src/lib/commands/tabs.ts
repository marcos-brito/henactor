import { tabsManager } from "$lib";
import { app } from "$lib/app.svelte";
import type { Tab } from "$lib/bindings";
import type { Command } from "./index";

export class NewTab implements Command<Tab | undefined> {
    public name = "NewTab";
    public desc = "";
    public keybinds = app.keybinds["NewTab"] || ["ctrl+t"];

    public async execute(tab?: Tab): Promise<void> {
        tabsManager.add(tab);
    }
}

export class CloseTab implements Command<number> {
    public name = "CloseTab";
    public desc = "";
    public keybinds = app.keybinds["NewTab"] || ["ctrl+d"];

    public async execute(idx: number): Promise<void> {
        tabsManager.close(idx);
    }
}

export class NextTab implements Command<{}> {
    public name = "NextTab";
    public desc = "";
    public keybinds = app.keybinds["NewTab"] || ["shift+l"];

    public async execute(): Promise<void> {
        tabsManager.next();
    }

    public async undo(): Promise<void> {
        tabsManager.previous();
    }
}

export class PreviousTab implements Command<{}> {
    public name = "PreviousTab";
    public desc = "";
    public keybinds = app.keybinds["NewTab"] || ["shift+h"];

    public async execute(): Promise<void> {
        tabsManager.previous();
    }

    public async undo(): Promise<void> {
        tabsManager.next();
    }
}
