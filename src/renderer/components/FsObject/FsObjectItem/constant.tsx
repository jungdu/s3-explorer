import { css } from "styled-components";

export const itemNameStyle = css`
  cursor: pointer;
  color: ${props => props.theme.objectNameColor};

  &:hover {
    color: ${props => props.theme.hoveredObjectNameColor};
  }
`;
