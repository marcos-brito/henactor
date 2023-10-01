export enum DirectoryEntryType {
    Directory,
    File,
    Link,
}

export interface DirectoryEntry {
    name: string;
    path: string;
    type: DirectoryEntryType;
}

export interface Workspace {
    name: string;
    path: string;
}
