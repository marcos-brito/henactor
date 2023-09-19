import { Container, Title, ItemsContainer } from "./Sidebar.styles.tsx";

interface Props {
    title: string;
    children: React.ReactNode;
}

function SideBar(props: Props) {
    return (
        <>
            <Container>
                <Title>{props.title}</Title>
                <ItemsContainer>{props.children}</ItemsContainer>
            </Container>
        </>
    );
}

export default SideBar;
