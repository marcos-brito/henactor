import {
    EntryContainer,
    EntryContainerInline,
    Entry,
    EntryData,
    MockedIcon,
} from "./DirEntry.style.tsx";
import { DirectoryEntry } from "@/type.ts";

interface Props {
    inline: Boolean;
    metadata: DirectoryEntry;
    onDoubleClick: any;
}

function DirEntry(props: Props) {
    if (props.inline) {
        return (
            <EntryContainerInline
                onDoubleClick={() => {
                    props.onDoubleClick(props.metadata.path);
                }}
            >
                <Entry>
                    <MockedIcon />
                    <p>{props.metadata.name}</p>
                </Entry>
                <EntryData>
                    <p>fadfas</p>
                    <p>fadfas</p>
                    <p>...</p>
                </EntryData>
            </EntryContainerInline>
        );
    }

    return (
        <EntryContainer
            onDoubleClick={() => {
                props.onDoubleClick(props.metadata.path);
            }}
        >
            <MockedIcon />
            <p>{props.metadata.name}</p>
        </EntryContainer>
    );
}

export default DirEntry;
