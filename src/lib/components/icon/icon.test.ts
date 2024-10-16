import { expect, describe, it } from "vitest"
import { IconType, identifyIcon } from "./icon"

describe("idenfityIcon", () => {
    it("should return Icon for iconify strings", () => {
        const icons = [
            "lucide:home",
            "material-symbols:add-location-alt-rounded",
            "tabler:alien-filled"
        ]

        for (const icon of icons) {
            expect(IconType[identifyIcon(icon)]).toBe(IconType[IconType.Icon])
        }
    })

    it("should return Url for urls", () => {
        const icons = [
            "https://example.com:8080/path/page?query=value#fragment",
            "ftp://ftp.example.com:21/folder/file.txt",
            "file:///C:/Users/username/Documents/file.txt",
            "mailto:someone@example.com?subject=Hello&body=Message",
            "ws://example.com/socket"
        ]

        for (const icon of icons) {
            expect(IconType[identifyIcon(icon)]).toBe(IconType[IconType.Url])
        }

    })
})


// describe("IconResolver", () => {
//     beforeAll(() => {
//         // @ts-ignore
//         mockIPC((cmd, args) => {
//             switch (cmd) {
//                 case "plugin:path|resolve_directory":
//                     return "/cache"
//                 case "download_or_find":
//                     // @ts-ignore
//                     return `${args.cacheDir}/ ${Math.random()}`
//                 default:
//                     break;
//             }
//         });
//
//         Object.defineProperty(window, "__TAURI_INTERNALS__", {
//             value: {
//                 convertFileSrc: (filePath: string, _protocol: string) => `asset://${filePath}`,
//                 invoke: (cmd: string, args: InvokeArgs, options: InvokeOptions) => invoke(cmd, args, options)
//             },
//         });
//
//     });
//
//     it("should resolve relative paths", async () => {
//         const resolver = new IconResolver("./some/icon", "/theme")
//
//         expect(await resolver.resolve()).toBe("/theme/./some/icon")
//     })
//
//     it("should resolve iconify strings", async () => {
//         const icon = "material-symbols:add-location-alt-rounded";
//
//         const resolver = new IconResolver(icon, "/theme")
//         expect(await resolver.resolve()).toBe("https://api.iconify.design/material-symbols/add-location-alt-rounded")
//
//     })
//
// })
