import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    gap: 16px;
`;

export const PathSlice = styled.p`
    font-size: ${(props) => props.theme.regular_text};
    color: ${(props) => props.theme.text_dark};
    cursor: pointer;
`;
