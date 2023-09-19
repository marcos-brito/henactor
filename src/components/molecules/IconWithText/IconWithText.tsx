import { Container, Text } from "./IconWithText.styles.tsx";

interface Props {
    text: string;
    icon: string;
}
function IconWithText(props: Props) {
    return (
        <>
            <Container>
                <div>{props.icon}</div>
                <Text>{props.text}</Text>
            </Container>
        </>
    );
}

export default IconWithText;
