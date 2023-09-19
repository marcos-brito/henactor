import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 12px;
`;

export const Text = styled.p`
  color: ${(props) => props.theme.text_dark};
  font-size: ${(props) => props.theme.regular_text};
`;
