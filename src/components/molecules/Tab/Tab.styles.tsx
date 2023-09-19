import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.highlight};
  width: 200px;
  height: 40px;
  display: flex;
  border-radius: 8px;
  justify-content: center;
  padding: 10px;
`;

export const Title = styled.p`
  text-align: center;
  color: ${(props) => props.theme.text_dark};
  font-size: ${(props) => props.theme.regular_text};
  flex-grow: 2;
`;
