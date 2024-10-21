import { expect, describe, it, beforeAll, afterEach, beforeEach } from "vitest"
import { createTabsManager } from "./app.svelte"
import { mockIPC, clearMocks } from "@tauri-apps/api/mocks"
import type { Tab } from "./bindings";
// @ts-ignore
import { randomFillSync } from 'crypto';

afterEach(() => {
    clearMocks();
})

beforeAll(() => {
    Object.defineProperty(window, 'crypto', {
        value: {
            // @ts-ignore
            getRandomValues: (buffer) => {
                return randomFillSync(buffer);
            },
        },
    });
});


describe("TabsManager", () => {
    function createTabs(quantity: number): Array<Tab> {
        const tabs: Array<Tab> = [];

        for (let i = 0; i < quantity; i++) {
            tabs.push({
                name: i.toString(),
                path: "",
                query: null,
                grid_size: null,
                view: null
            })
        }

        return tabs;
    }

    beforeEach(() => {
        //@ts-ignore
        mockIPC((cmd) => {
            if (cmd === "plugin:path|resolve_directory") {
                return ""
            }
        });
    })

    it("Should close all tabs behind N", async () => {
        const tabs = await createTabsManager(createTabs(10));
        tabs.closeBehind(7);
        expect(tabs._.length).toBe(3)
        expect(tabs.current?.name).toMatch("9")
    })
    it("Should close all tabs ahead of N", async () => {
        const tabs = await createTabsManager(createTabs(10));
        tabs.closeAhead(4);
        expect(tabs.current?.name).toMatch("4")
        expect(tabs._.length).toBe(5)
    })

    it("Should close all tabs except N", async () => {
        const tabs = await createTabsManager(createTabs(10));
        tabs.closeAllExcept(5);
        expect(tabs._.length).toBe(1)
        expect(tabs.current?.name).toMatch("5")
    })

    it("Should duplicate a tab", async () => {
        const tabs = await createTabsManager(createTabs(10));
        tabs.duplicate(5);
        expect(tabs._[5]).toEqual(tabs._[6])
        expect(tabs.currentIdx).toBe(6)
    })
})
