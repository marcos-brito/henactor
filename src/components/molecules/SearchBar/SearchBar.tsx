import { Container, Input } from "./SearchBar.styles.tsx";

interface Props {
    placeholder: string;
}

function SearchBar(props: Props) {
    return (
        <>
            <Container>
                <div>I</div>
                <Input placeholder={props.placeholder} />
            </Container>
        </>
    );
}

export default SearchBar;
