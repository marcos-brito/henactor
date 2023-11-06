import { useState, useEffect, useContext } from "react";
import { getDirEntries } from "@services/file_system.ts";
import { FileSystemEntry } from "@/type.ts";
import DirEntry from "@components/molecules/DirEntry/DirEntry.tsx";
import { GridContainer, ListContainer } from "./DirContent.styles.tsx";
import { pathContext } from "@/context/PathContext.tsx";
import { viewContext, ViewMode } from "@context/ViewContext.tsx";

function DirContent() {
    const { path, setPath } = useContext(pathContext);
    const { viewMode } = useContext(viewContext);
    const [currentContent, setCurrentContent] = useState(
        Array<FileSystemEntry>,
    );

    async function updateContent(path: string) {
        let entries: Array<FileSystemEntry>;
        try {
            entries = await getDirEntries(path);
            setCurrentContent(entries);
        } catch (e) {
            return <div>aaaaaa</div>;
        }
    }

    useEffect(() => {
        updateContent(path);
    }, [path]);

    // This is passed to the childrens
    function onEntryClick(path: string): void {
        setPath(path);
    }

    if (viewMode === ViewMode.GRID) {
        return (
            <>
                <GridContainer>
                    {currentContent.map((entry) => {
                        return (
                            <DirEntry
                                key={entry.path}
                                onDoubleClick={onEntryClick}
                                metadata={entry}
                                inline={false}
                            ></DirEntry>
                        );
                    })}
                </GridContainer>
            </>
        );
    }

    if (viewMode === ViewMode.LIST) {
        return (
            <>
                <ListContainer>
                    {currentContent.map((entry) => {
                        return (
                            <DirEntry
                                key={entry.path}
                                onDoubleClick={onEntryClick}
                                metadata={entry}
                                inline={true}
                            ></DirEntry>
                        );
                    })}
                </ListContainer>
            </>
        );
    }
}

export default DirContent;
