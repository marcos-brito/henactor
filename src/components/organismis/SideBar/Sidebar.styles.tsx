import styled from "styled-components";

export const Container = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 64px;
  align-content: center;
  padding: 52px;
  width: 20vw;
  height: 100vh;
  background-color: ${(props) => props.theme.background_dark};
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.text_dark};
  font-size: ${(props) => props.theme.big_title};
`;

export const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  overflow: scroll;
`;
