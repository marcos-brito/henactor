import { useEffect } from "react";
import {
    EntryContainer,
    EntryContainerInline,
    Entry,
    EntryData,
    MockedIcon,
} from "./DirEntry.style.tsx";
import { FileSystemEntry } from "@/type.ts";
import { formatTimeStamp } from "@utils/date.ts";

interface Props {
    inline: boolean;
    metadata: FileSystemEntry;
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
                    <p>
                        {props.metadata.createad
                            ? formatTimeStamp(
                                  props.metadata.createad.secs_since_epoch,
                              )
                            : "---"}
                    </p>
                    <p>
                        {props.metadata.modified
                            ? formatTimeStamp(
                                  props.metadata.modified.secs_since_epoch,
                              )
                            : "---"}
                    </p>
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
