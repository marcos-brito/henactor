import { ThemeProvider } from "styled-components";
import { getThemeFile } from "@services/config.ts";
import { useEffect, useState } from "react";

interface Props {
    children: React.ReactNode;
}

function Theme(props: Props) {
    const [theme, setTheme] = useState({});

    async function fetchTheme() {
        let theme;

        try {
            theme = await getThemeFile();
        } catch (error) {
            console.log("Did not load theme file");
            console.log(error);
        }
        // let fonts = await get_fonts();
        setTheme(Object.assign({}, theme));
    }

    useEffect(() => {
        fetchTheme();
    }, []);

    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

export default Theme;
