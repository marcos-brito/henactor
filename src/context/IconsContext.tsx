import { useState, createContext, useEffect } from "react";
import { getIconsFile } from "@services/config.ts";
import { Icons } from "@services/config/icons.ts";

export const iconsContext = createContext<Icons | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export function IconsProvider(props: Props) {
    const [icons, setIcons] = useState<Icons | undefined>();

    async function fetchIcons() {
        let icons;

        try {
            icons = await getIconsFile();
            setIcons(icons);
        } catch (error) {
            console.log("Did not load icons file");
            console.log(error);
        }
    }

    useEffect(() => {
        fetchIcons();
    }, []);

    return (
        <iconsContext.Provider value={icons}>
            {props.children}
        </iconsContext.Provider>
    );
}
