import React from "react";
import styled from "styled-components";
import { uiState } from "@renderer/context";
import { actionButtonStyle } from "./constants";
import { useObserver } from "mobx-react";
import IcBackArrow from "@renderer/image/IcBackArrow";

const Self = styled.button<{ sidebarShown: boolean }>`
  ${actionButtonStyle}
  ${props =>
    props.sidebarShown
      ? ""
      : `transform: rotateY(180deg);`}
  transition: transform 300ms;
`;

const SideToogleButton: React.FC = () =>
  useObserver(() => {
    const { sidebarShown, toogleSidebarShown } = uiState.useStore();

    return (
      <Self onClick={toogleSidebarShown} sidebarShown={sidebarShown}>
        <IcBackArrow />
      </Self>
    );
  });

export default SideToogleButton;
