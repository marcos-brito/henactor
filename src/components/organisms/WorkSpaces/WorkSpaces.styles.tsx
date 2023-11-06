import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    display: fixed;
    gap: 16px;
`;

export const Title = styled.p`
    color: ${(props) => props.theme.text_light};
    font-size: ${(props) => props.theme.regular_text};
`;

export const TabsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 32px;
`;
