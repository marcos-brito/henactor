import { useState, createContext } from "react";

export enum ViewMode {
    GRID,
    LIST,
}

interface ViewContextData {
    viewMode: ViewMode;
    setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}

export const viewContext = createContext<ViewContextData | undefined>(
    undefined,
);

interface Props {
    children: React.ReactNode;
}

export function ViewProvider(props: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);

    return (
        <viewContext.Provider value={{ viewMode, setViewMode }}>
            {props.children}
        </viewContext.Provider>
    );
}
