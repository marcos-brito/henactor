import { expect, describe, it, afterEach, beforeAll, beforeEach } from "vitest";
import { mockIPC, clearMocks } from "@tauri-apps/api/mocks";
import { IconType, identifyIcon, resolve } from "./resolver";
// @ts-ignore
import { randomFillSync } from "crypto";

afterEach(() => {
    clearMocks();
});

beforeAll(() => {
    Object.defineProperty(window, "crypto", {
        value: {
            // @ts-ignore
            getRandomValues: (buffer) => {
                return randomFillSync(buffer);
            },
        },
    });
});

describe("idenfityIcon", () => {
    it("should return Icon for iconify strings", () => {
        const icons = [
            "lucide:home",
            "material-symbols:add-location-alt-rounded",
            "tabler:alien-filled",
        ];

        for (const icon of icons) {
            expect(IconType[identifyIcon(icon)]).toBe(IconType[IconType.Icon]);
        }
    });

    it("should return Url for urls", () => {
        const icons = [
            "https://example.com:8080/path/page?query=value#fragment",
            "ftp://ftp.example.com:21/folder/file.txt",
            "file:///C:/Users/username/Documents/file.txt",
            "mailto:someone@example.com?subject=Hello&body=Message",
            "ws://example.com/socket",
        ];

        for (const icon of icons) {
            expect(IconType[identifyIcon(icon)]).toBe(IconType[IconType.Url]);
        }
    });
});

describe("resolve", () => {
    beforeEach(async () => {
        // @ts-ignore
        mockIPC((cmd, args) => {
            switch (cmd) {
                case "download_or_find":
                    // @ts-ignore
                    return `${args.cacheDir}/${Math.random()}`;
            }
        });
    });

    it("should return cached URL download is true", async () => {
        const uri = await resolve("http://joe.com/doe.png", "", true);
        expect(uri).toMatch(/^asset:\/\//);
    })

    it("should return cached Icon when download is true", async () => {
        const uri = await resolve("some:icon", "", true);
        expect(uri).toMatch(/^asset:\/\//);
    })

    it("should resolve relative paths to basePath", async () => {
        const uri = await resolve("./some/icon.png", "/base/path", true);
        expect(uri).toMatch(`asset:///base/path/some/icon.png`);
    });

    it("should return iconify url when download is false", async () => {
        const uri = await resolve("some:icon", "", false);
        expect(uri).toMatch(`https://api.iconify.design/some/icon.svg`);
    });

    it("should return the url itself when download is false", async () => {
        const uri = await resolve("https://some.com/icon.svg", "", false);
        expect(uri).toMatch("https://some.com/icon.svg");
    });
});
