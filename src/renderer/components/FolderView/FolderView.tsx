import React from "react";
import styled from "styled-components";

import { FsObject } from "@renderer/types/fs";

import FolderViewItem from "./FolderViewItem";

const Self = styled.div`
  width: 100%;
  height: 300px;
  border: 1px lavender solid;
`;

const Text = styled.div`
  color: #555;
  font-size: 17px;
  margin: 10px 0 0 10px;
`;

interface Props {
  fsObjects: Array<FsObject>;
}

const FolderView: React.FC<Props> = ({ fsObjects }) => {
  const folderViewItems = fsObjects.map(fsObject => (
    <FolderViewItem key={fsObject.id} fsObject={fsObject} />
  ));

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      console.log("event.dataTransfer :", event.dataTransfer.files[0].path);
    }
  };

  const handlePreventDefault = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Self
      onDrop={handleDrop}
      onDragEnter={handlePreventDefault}
      onDragOver={handlePreventDefault}
    >
      {fsObjects.length > 0 ? folderViewItems : <Text>Empty...</Text>}
    </Self>
  );
};

export default FolderView;
