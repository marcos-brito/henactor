import { Container, Text } from "./IconWithText.styles.tsx";

interface Props {
    text: string;
    icon: string;
    onClick?: (arg0: any) => void;
}
function IconWithText(props: Props) {
    return (
        <>
            <Container onClick={props.onClick}>
                <div>{props.icon}</div>
                <Text>{props.text}</Text>
            </Container>
        </>
    );
}

export default IconWithText;
