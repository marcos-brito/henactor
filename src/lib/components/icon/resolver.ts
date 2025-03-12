import { convertFileSrc } from "@tauri-apps/api/core";
import { commands } from "$lib/bindings";
import { path as pathApi } from "@tauri-apps/api";

// prefix:name:hexColor
// ":hexColor" is optional
const iconRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*(?::#[0-9a-fA-F]{6})?$/;

// downloadOrFind might take some time to hash the url and iterate
// over the cache, so we memoize the results.
// Caching the cache... funny right?
const memoized: Record<string, string> = {};

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

export async function resolve(
    iconString: string,
    basePath: string,
    download: boolean,
): Promise<string> {
    const iconType = identifyIcon(iconString);

    if (download) {
        if (memoized[iconString]) return memoized[iconString];

        const cacheDir = await pathApi.appCacheDir();

        if (iconType == IconType.Icon) {
            const url = convertFileSrc(
                await commands.downloadOrFind(cacheDir, buildIconifyUri(iconString)),
            );
            memoized[iconString] = url;
            return url;
        }

        if (iconType == IconType.Url) {
            const url = convertFileSrc(await commands.downloadOrFind(cacheDir, iconString));
            memoized[iconString] = url;
            return url;
        }
    }

    if (iconType == IconType.Icon) return buildIconifyUri(iconString);
    if (iconType == IconType.RelativePath)
        convertFileSrc(await buildRelativeUri(iconString, basePath));
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

async function buildRelativeUri(iconString: string, basePath: string): Promise<string> {
    return await pathApi.join(basePath, iconString);
}
