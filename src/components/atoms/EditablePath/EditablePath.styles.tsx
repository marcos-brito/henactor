import styled from "styled-components";

export const Input = styled.input`
    background-color: transparent;
    color: ${(props) => props.theme.text_light};
    font-size: ${(props) => props.theme.small_text};
    outline: none;
    border: none;
`;
