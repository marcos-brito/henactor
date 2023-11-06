import MainPageTemplate from "@components/templates/MainPageTemplate/MainPageTemplate.tsx";
import SideBarTemplate from "@components/templates/SideBarTemplate/SideBarTemplate.tsx";
import MainContentTemplate from "@components/templates/MainContentTemplate/MainContentTemplate";
import { PathProvider } from "@context/PathContext";

function Main() {
    return (
        <>
            <PathProvider>
                <MainPageTemplate>
                    <SideBarTemplate />
                    <MainContentTemplate />
                </MainPageTemplate>
            </PathProvider>
        </>
    );
}

export default Main;
