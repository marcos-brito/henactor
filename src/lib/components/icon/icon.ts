import { convertFileSrc } from "@tauri-apps/api/core";
import { commands } from "$lib/bindings";
import { path as pathApi } from "@tauri-apps/api";
import { app } from "$lib/app.svelte";

// prefix:name:hexColor
// ":hexColor" is optional
const iconRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*(?::#[0-9a-fA-F]{6})?$/;

export enum IconType {
    Url,
    RelativePath,
    AbsolutePath,
    Icon,
    Text,
}

export function identifyIcon(icon: string): IconType {
    if (icon.startsWith(".")) return IconType.RelativePath;
    if (icon.startsWith(pathApi.sep())) return IconType.AbsolutePath;
    if (icon.match(iconRegex)) return IconType.Icon;
    if (URL.canParse(icon)) return IconType.Url;

    return IconType.Text;
}

export async function resolve(iconString: string, iconType: IconType, themeName: string | undefined = undefined): Promise<string> {
    if (app.options.download_icons) {
        const cacheDir = await pathApi.appCacheDir();

        if (iconType == IconType.Icon)
            return convertFileSrc(await commands.downloadOrFind(cacheDir, buildIconifyUri(iconString)))

        if (iconType == IconType.Url)
            return convertFileSrc(await commands.downloadOrFind(cacheDir, iconString))
    }

    if (iconType == IconType.Icon) return buildIconifyUri(iconString);
    if (iconType == IconType.RelativePath) convertFileSrc(await buildRelativeUri(iconString, themeName))
    if (iconType == IconType.AbsolutePath) convertFileSrc(iconString);

    return iconString;
}


function buildIconifyUri(iconString: string): string {
    const url = "https://api.iconify.design";
    let [prefix, icon, color] = iconString.split(":");

    if (color) {
        color = color.replace("#", "%23");
        return `${url}/${prefix}/${icon}.svg?color=${color}`;
    }

    return `${url}/${prefix}/${icon}.svg`;
}

async function buildRelativeUri(iconString: string, themeName: string | undefined): Promise<string> {
    const configDir = await pathApi.appConfigDir();
    if (themeName) return await pathApi.join("themes", themeName, iconString);
    return await pathApi.join(configDir, iconString);
}
