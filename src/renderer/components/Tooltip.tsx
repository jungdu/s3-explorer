import React from "react";
import styled, { css } from "styled-components";

type Direction = "TOP" | "RIGHT" | "LEFT" | "BOTTOM";

interface PopupPosition {
  direction: Direction;
  margin?: string;
}

const Self = styled.div<PopupPosition>`
  display: none;
  position: absolute;
  padding: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  border-radius: 5px;
  white-space: pre;

  *:hover > & {
    display: block;
  }

  ${props => {
    switch (props.direction) {
      case "TOP":
        return css`
          bottom: calc(100% + ${props.margin});
          left: 50%;
          transform: translate(-50%, 0);
        `;
      case "RIGHT":
        return css`
          right: calc(100% + ${props.margin});
          top: 50%;
          transform: translate(0, -50%);
        `;
      case "BOTTOM":
        return css`
          top: calc(100% + ${props.margin});
          left: 50%;
          transform: translate(-50%, 0);
        `;
      case "LEFT":
        return css`
          right: calc(100% + ${props.margin});
          top: 50%;
          transform: translate(0, -50%);
        `;
      default:
        throw new Error(`${props.direction} is not type of direction`);
    }
  }}
`;

type Props = PopupPosition;

const ToolTip: React.FC<Props> = ({ children, direction, margin = "5px" }) => {
  return (
    <Self direction={direction} margin={margin}>
      {children}
    </Self>
  );
};

export default ToolTip;
