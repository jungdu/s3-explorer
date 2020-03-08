import CreateFolderButton from "@renderer/components/Button/CreateFolderButton";
import DeleteButton from "@renderer/components/Button/DeleteButton";
import DownloadButton from "@renderer/components/Button/DownloadButton";
import React from "react";
import styled from "styled-components";

const FromDownloadButton = styled(DownloadButton)`
  flex-shrink: 0;
  margin-left: auto;
`;

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
      <FromDownloadButton />
      <DeleteButton />
      <CreateFolderButton />
    </Self>
  );
};

export default Actions;
