import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;
export const Title = styled.p`
  color: ${(props) => props.theme.text_light};
  font-size: ${(props) => props.theme.regular_text};
`;
