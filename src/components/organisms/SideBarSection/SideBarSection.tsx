import { Container, Title } from "./SideBarSection.styles.tsx";

interface Props {
    title: string;
    children: React.ReactNode;
}

function SideBarSection(props: Props) {
    return (
        <>
            <Container>
                <Title>{props.title}</Title>
                {props.children}
            </Container>
        </>
    );
}

export default SideBarSection;
