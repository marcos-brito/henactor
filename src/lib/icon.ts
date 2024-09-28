import { convertFileSrc } from "@tauri-apps/api/core";
import { commands, type Config } from "../bindings";
import { path } from "@tauri-apps/api";

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

export class IconResolver {
    private config: Config;
    private iconString: string;
    private iconType: IconType;

    constructor(iconString: string, config: Config) {
        this.iconString = iconString;
        this.iconType = identifyIcon(iconString);
        this.config = config;
    }

    public async resolve(): Promise<string> {
        let resolution = this.iconString

        if (this.iconType == IconType.Text) return resolution;

        if (this.iconType == IconType.Icon)
            resolution = this.buildIconifyUri()

        if (this.iconType == IconType.RelativePath)
            resolution = await this.buildRelativeUri();

        if (this.shouldDownload()) {
            console.log(resolution)
            const cacheDir = await path.appCacheDir()
            resolution = await commands.downloadOrFind(cacheDir, resolution)
        }

        return convertFileSrc(resolution)
    }

    private shouldDownload(): boolean {
        return this.config.download_icons &&
            (this.iconType == IconType.Url || this.iconType == IconType.Icon)
    }

    private buildIconifyUri(): string {
        const url = "https://api.iconify.design"
        let [prefix, icon, color] = this.iconString.split(":")

        if (color) {
            color = color.replace("#", "%23")
            return `${url}/${prefix}/${icon}.svg?color=${color}`
        }

        return `${url}/${prefix}/${icon}.svg`;
    }

    private async buildRelativeUri(): Promise<string> {
        const configDir = await path.appConfigDir();
        return await path.join(configDir, this.iconString)
    }
}
