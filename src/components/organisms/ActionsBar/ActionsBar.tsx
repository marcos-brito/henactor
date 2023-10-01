import IconWithText from "@components/molecules/IconWithText/IconWithText.tsx";
import SearchBar from "@components/molecules/SearchBar/SearchBar.tsx";
import Path from "@components/molecules/Path/Path.tsx";
import { Container, ActionsContainer } from "./ActionsBar.styles.tsx";
import { iconsContext } from "@context/IconsContext.tsx";
import { viewContext, ViewMode } from "@context/ViewContext.tsx";
import { useContext } from "react";

function ActionsBar() {
    const { viewMode, setViewMode } = useContext(viewContext);
    const icons = useContext(iconsContext);

    function onViewClick() {
        if (viewMode === ViewMode.GRID) {
            setViewMode(ViewMode.LIST);
        } else {
            setViewMode(ViewMode.GRID);
        }
    }

    return (
        <>
            <Container>
                <Path />
                <ActionsContainer>
                    <IconWithText text="View" icon="s" onClick={onViewClick} />
                    <IconWithText text="Sort by" icon="s" />
                    <IconWithText text="Filter" icon="f" />
                    <SearchBar placeholder="Lost something?" />
                </ActionsContainer>
            </Container>
        </>
    );
}

export default ActionsBar;
