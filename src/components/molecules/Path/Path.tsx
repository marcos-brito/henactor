import { Container } from "./Path.styles.tsx";
import EditablePath from "@components/atoms/EditablePath/EditablePath.tsx";
import ClickablePath from "@components/atoms/ClickablePath/ClickablePath.tsx";

function Path() {
    return (
        <>
            <Container>
                <ClickablePath />
                <EditablePath />
            </Container>
        </>
    );
}

export default Path;
