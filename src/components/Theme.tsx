import { ThemeProvider } from "styled-components";
import { get_pallete } from "../config/pallete.ts";
import { get_fonts } from "../config/fonts.ts";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

function Theme(props: Props) {
  const [theme, setTheme] = useState({});
  useEffect(() => {
    async function fetch_theme() {
      try {
        let theme = await get_pallete();
        let fonts = await get_fonts();
        setTheme(Object.assign({}, theme, fonts));
      } catch (error) {
        console.log(error);
      }
    }
    fetch_theme();
  });

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

export default Theme;
