import Actions from "@renderer/components/Actions";
import FolderView from "@renderer/components/FolderView";
import React from "react";
import styled from "styled-components";
import WatchingFolder from "@renderer/components/WatchingFolder";

const Self = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100vh;
  overflow-x: auto;
`;

const MainSection: React.FC = () => {
  return (
    <Self>
      <Actions></Actions>
      <WatchingFolder />
      <FolderView></FolderView>
    </Self>
  );
};

export default MainSection;
