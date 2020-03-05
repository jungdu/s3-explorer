import DeleteButton from "./Button/DeleteButton";
import DownloadButton from "./Button/DownloadButton";
import WatchingFolder from "@renderer/components/WatchingFolder";
import React from "react";
import styled from "styled-components";

const Self = styled.div`
  display: flex;
  justify-content: baseline;
  align-items: center;
  height: 30px;
  padding: 0px 10px;
`;

const Actions: React.FC = () => {
  return (
    <Self>
      <WatchingFolder />
      <DownloadButton />
      <DeleteButton />
    </Self>
  );
};

export default Actions;
