import styled from "styled-components";

export const Container = styled.div`
    widht: 200px;
    height: 40px;
    background-color: ${(props) => props.theme.highlight};
    display: flex;
    gap: 12px;
    border-radius: 8px;
    padding: 10px;
`;

export const Input = styled.input`
    background-color: transparent;
    outline: none;
    color: ${(props) => props.theme.text_dark};
    font-size: ${(props) => props.theme.regular_text};
    border: none;
`;
