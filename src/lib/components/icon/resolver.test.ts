import { expect, describe, it, } from "vitest";
import { IconType, identifyIcon } from "./resolver";

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
