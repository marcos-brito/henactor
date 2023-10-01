import { Input } from "./EditablePath.styles.tsx";
import { pathContext } from "@context/PathContext.tsx";
import { useContext, useEffect, useState } from "react";
import { ChangeEvent } from "react";

function EditablePath() {
    const { path, setPath } = useContext(pathContext);
    const [inputValue, setInputValue] = useState(path);

    useEffect(() => {
        setInputValue(path);
    }, [path]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setPath(e.target.value);
    }

    return (
        <>
            <Input onChange={(e) => handleChange(e)} value={inputValue} />
        </>
    );
}

export default EditablePath;
