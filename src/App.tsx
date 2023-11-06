import Theme from "@context/ThemeContext";
import Main from "@components/pages/Main/Main.tsx";
import { IconsProvider } from "@context/IconsContext";

function App() {
    return (
        <>
            <IconsProvider>
                <Theme>
                    <Main />
                </Theme>
            </IconsProvider>
        </>
    );
}

export default App;
