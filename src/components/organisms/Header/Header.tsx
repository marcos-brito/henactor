import { Container } from "./Header.styles.tsx";
import WorkSpaces from "../WorkSpaces/WorkSpaces.tsx";
import TextWithIcon from "../../molecules/IconWithText/IconWithText.tsx";

function Header() {
    return (
        <>
            <Container>
                <WorkSpaces title="Workspaces" />
                <TextWithIcon icon="S" text="Settings" />
            </Container>
        </>
    );
}

export default Header;
