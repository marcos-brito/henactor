import { expect, describe, it } from "vitest";
import { TabsManager } from "./tabs_manager.svelte";
import type { Tab } from "$lib/bindings";

describe("TabsManager", () => {
    function createTabs(quantity: number): Array<Tab> {
        const tabs: Array<Tab> = [];

        for (let i = 0; i < quantity; i++) {
            tabs.push({
                name: i.toString(),
                path: "",
                query: "",
                filter: "",
                sort_by: "Natural",
                grid_size: 4,
                view: "Grid",
                list_columns: [],
                selected: [],
            });
        }

        return tabs;
    }

    it("Should close all tabs behind N", async () => {
        const tabsManager = new TabsManager(createTabs(10), createTabs(1)[0]);
        tabsManager.closeBehind(7);
        expect(tabsManager.tabs.length).toBe(3);
        expect(tabsManager.current?.name).toMatch("7");
    });

    it("Should close all tabs ahead of N", async () => {
        const tabsManager = new TabsManager(createTabs(10), createTabs(1)[0]);
        tabsManager.closeAhead(4);
        expect(tabsManager.current?.name).toMatch("4");
        expect(tabsManager.tabs.length).toBe(5);
    });

    it("Should close all tabs except N", async () => {
        const tabsManager = new TabsManager(createTabs(10), createTabs(1)[0]);
        tabsManager.closeAllExcept(5);
        expect(tabsManager.tabs.length).toBe(1);
        expect(tabsManager.current?.name).toMatch("5");
    });

    it("Should duplicate a tab", async () => {
        const tabsManager = new TabsManager(createTabs(10), createTabs(1)[0]);
        tabsManager.duplicate(5);
        expect(tabsManager.tabs[5]).toEqual(tabsManager.tabs[6]);
        expect(tabsManager.currentIdx).toBe(6);
    });
});
