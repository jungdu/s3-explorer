import { css } from "styled-components";

export const actionButtonStyle = css`
  padding: 0;
  margin: 0;
  svg path {
    fill: ${props => props.theme.color.greyLight} !important;
  }

  &:enabled {
    cursor: pointer;
    svg path {
      fill: ${props => props.theme.color.grey} !important;
    }
  }
`;
