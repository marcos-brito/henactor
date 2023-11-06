export enum FileSystemEntryType {
    Directory,
    File,
    Link,
}

export interface FileSystemEntry {
    name: string;
    path: string;
    createad: SystemTime | null;
    modified: SystemTime | null;
    content_type: FileSystemEntryType;
}

interface SystemTime {
    nanos_since_epoch: number;
    secs_since_epoch: number;
}

export interface Workspace {
    name: string;
    path: string;
}
