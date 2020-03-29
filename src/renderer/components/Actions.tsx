import { default as CreateFolderButtonOrig } from "@renderer/components/Button/CreateFolderButton";
import { default as DeleteButtonOrig } from "@renderer/components/Button/DeleteButton";
import { default as DownloadButtonOrig } from "@renderer/components/Button/DownloadButton";
import SideToogleButton from "@renderer/components/Button/SideToogleButton";
import React from "react";
import styled from "styled-components";

const CreateFolderButton = styled(CreateFolderButtonOrig)`
  margin-left: 16px;
`;

const DeleteButton = styled(DeleteButtonOrig)`
  margin-left: 16px;
`;

const DownloadButton = styled(DownloadButtonOrig)`
  flex-shrink: 0;
  margin-left: auto;
`;

const Self = styled.div`
  display: flex;
  justify-content: baseline;
  align-items: center;
  height: 56px;
  padding: 0px 20px 0px 10px;
`;

const Actions: React.FC = () => {
  return (
    <Self>
      <SideToogleButton />
      <DownloadButton />
      <DeleteButton />
      <CreateFolderButton />
    </Self>
  );
};

export default Actions;
