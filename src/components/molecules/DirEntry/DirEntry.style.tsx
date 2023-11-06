import styled from "styled-components";

export const EntryContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    color: ${(props) => props.theme.text_dark};
    font-size: ${(props) => props.theme.regular_text};
    &:hover {
        background-color: ${(props) => props.theme.highlight};
    }
`;

export const EntryContainerInline = styled.div`
    display: flex;
    padding: 12px;
    border-radius: 8px;
    align-items: center;
    color: ${(props) => props.theme.text_dark};
    font-size: ${(props) => props.theme.regular_text};
    &:hover {
        background-color: ${(props) => props.theme.highlight};
    }
`;

export const Entry = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 50%;
`;

export const EntryData = styled.div`
    display: flex;
    width: 50%;
    align-items: flex-end;
    justify-content: space-between;
`;

export const MockedIcon = styled.div`
    width: 85px;
    height: 85px;
    background-color: ${(props) => props.theme.colors.yellow};
`;
