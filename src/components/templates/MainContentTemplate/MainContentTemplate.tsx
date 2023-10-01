import Header from "@components/organisms/Header/Header.tsx";
import ActionsBar from "@components/organisms/ActionsBar/ActionsBar.tsx";
import DirContent from "@components/organisms/DirContent/DirContent.tsx";
import { MainContentContainer } from "./MainContentTemplate.styles.tsx";
import { ViewProvider } from "@context/ViewContext.tsx";

function MainContentTemplate() {
    return (
        <>
            <ViewProvider>
                <MainContentContainer>
                    <Header />
                    <ActionsBar />
                    <DirContent />
                </MainContentContainer>
            </ViewProvider>
        </>
    );
}

export default MainContentTemplate;
