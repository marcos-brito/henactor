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
    if (icon.startsWith("/")) return IconType.AbsolutePath;
    if (icon.match(iconRegex)) return IconType.Icon;
    if (URL.canParse(icon)) return IconType.Url;

    return IconType.Text;
}

export async function resolve(iconString: string, iconType: IconType, themeName: string | undefined = undefined): Promise<string> {
    let resolution = iconString;

    if (iconType == IconType.Text) return resolution;

    if (iconType == IconType.Icon) resolution = buildIconifyUri(iconString);

    if (iconType == IconType.RelativePath) resolution = await buildRelativeUri(iconString, themeName);

    if (shouldDownload(iconType)) {
        const cacheDir = await pathApi.appCacheDir();
        resolution = await commands.downloadOrFind(cacheDir, resolution);
    }

    return convertFileSrc(resolution);
}

function shouldDownload(iconType: IconType): boolean {
    return (
        app.options.download_icons && (iconType == IconType.Url || iconType == IconType.Icon)
    );
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
