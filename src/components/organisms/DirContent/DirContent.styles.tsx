import styled from "styled-components";

export const ContentGridContainer = styled.section`
    width: 90 vw;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto;
    grid-column-gap: 112px;
    grid-row-gap: 56px;
`;

export const ContentListContainer = styled.section`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;
