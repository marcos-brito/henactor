import { Container } from "./MainPageTemplate.styles.tsx";

interface Props {
    children: React.ReactNode;
}

function MainPageTemplate(props: Props) {
    return (
        <>
            <Container>{props.children}</Container>
        </>
    );
}

export default MainPageTemplate;
