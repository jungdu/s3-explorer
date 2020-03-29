import { BucketContainer } from "@renderer/components/Bucket";
import Settings from "@renderer/components/Settings";
import { uiState } from "@renderer/context";
import React from "react";
import styled from "styled-components";
import { useObserver } from "mobx-react";

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
        <BucketContainer></BucketContainer>
      </Self>
    );
  });

export default SideBar;
