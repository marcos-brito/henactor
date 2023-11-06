import { createContext, useState } from "react";

interface PathContextData {
    path: string;
    setPath: React.Dispatch<React.SetStateAction<string>>;
}

export const pathContext = createContext<PathContextData | undefined>(
    undefined,
);

const defaultPath = "/";

interface Props {
    children: React.ReactNode;
}

export function PathProvider(props: Props) {
    const [path, setPath] = useState(defaultPath);

    return (
        <>
            <pathContext.Provider value={{ path, setPath }}>
                {props.children}
            </pathContext.Provider>
        </>
    );
}
