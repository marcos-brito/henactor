import { pathContext } from "@/context/PathContext";
import { iconsContext } from "@/context/IconsContext.tsx";
import { useContext, useEffect, useState } from "react";
import { PathSlice, Container } from "./ClickablePath.styles.tsx";

function ClickablePath() {
    const { path, setPath } = useContext(pathContext);
    const icons = useContext(iconsContext);
    const [clickablePath, setClicakblePath] = useState(path.split("/"));

    useEffect(() => {
        setClicakblePath(path.split("/"));
    }, [path]);

    function handleClick(index: number) {
        setPath(clickablePath.slice(0, index + 1).join("/"));
    }

    return (
        <>
            <Container>
                {clickablePath.map((slice: string, index: number) => {
                    return (
                        <PathSlice
                            onClick={() => {
                                handleClick(index);
                            }}
                            key={index}
                        >
                            {slice}
                        </PathSlice>
                    );
                })}
            </Container>
        </>
    );
}

export default ClickablePath;
