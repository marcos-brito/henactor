import { invoke } from "@tauri-apps/api";
import { useState, useEffect, ChangeEvent, useContext } from "react";
import { DirectoryEntry } from "@/type.ts";
import DirEntry from "@components/molecules/DirEntry/DirEntry.tsx";
import {
    ContentGridContainer,
    ContentListContainer,
} from "./DirContent.styles.tsx";
import { pathContext } from "@/context/PathContext.tsx";
import { viewContext, ViewMode } from "@context/ViewContext.tsx";

function DirContent() {
    const { path, setPath } = useContext(pathContext);
    const { viewMode } = useContext(viewContext);
    const [currentContent, setCurrentContent] = useState(Array<DirectoryEntry>);

    useEffect(() => {
        async function updateContent(path: string) {
            setCurrentContent(await get_content(path));
        }

        updateContent(path);
    }, [path]);

    async function get_content(path: string): Promise<Array<DirectoryEntry>> {
        let content: Array<DirectoryEntry> = await invoke("get_content", {
            path: path,
        });
        return content;
    }

    // This is passed to the childrens
    function onEntryClick(path: string): void {
        setPath(path);
    }

    if (viewMode === ViewMode.GRID) {
        return (
            <>
                <ContentGridContainer>
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
                </ContentGridContainer>
            </>
        );
    }

    if (viewMode === ViewMode.LIST) {
        return (
            <>
                <ContentListContainer>
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
                </ContentListContainer>
            </>
        );
    }
}

export default DirContent;
