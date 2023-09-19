import { Container, Title } from "./Tab.styles.tsx";

interface Props {
    title: string;
    icon: string;
}
function Tab(props: Props) {
    return (
        <>
            <Container>
                <Title>{props.title}</Title>
                <div>{props.icon}</div>
            </Container>
        </>
    );
}

export default Tab;
