import Buckets from "@renderer/components/Buckets";
import Settings from "@renderer/components/Settings";
import { uiState } from "@renderer/context";
import { useObserver } from "mobx-react";
import React from "react";
import styled from "styled-components";

const Self = styled.div<{ sidebarShown: boolean }>`
  ${props => (props.sidebarShown ? "flex-basis: 300px;" : "flex-basis: 0px;")}
  flex-shrink: 0;
  background: #f2f2f2;
  overflow-y: auto;
  height: 100vh;
  transition: flex-basis 300ms;
`;

const SideBar: React.FC = () =>
  useObserver(() => {
    const { sidebarShown } = uiState.useStore();
    return (
      <Self sidebarShown={sidebarShown}>
        <Settings></Settings>
        <Buckets></Buckets>
      </Self>
    );
  });

export default SideBar;
