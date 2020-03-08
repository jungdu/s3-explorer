import React, { useState } from "react";
import { useObserver } from "mobx-react";
import styled, { css } from "styled-components";

import { s3 } from "@renderer/context";

import FolderViewItem from "./FolderViewItem";

const dragOverStyle = css`
  &::after {
    content: "";
    position: absolute;
    display: flex;
    font-size: 20px;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const Self = styled.div<{ isUploadReady: boolean }>`
  position: relative;
  flex-grow: 1;
  width: 100%;
  border: 1px lavender solid;
  overflow-y: scroll;
  overflow-x: hidden;

  ${props => (props.isUploadReady ? dragOverStyle : ``)}
`;

const Text = styled.div`
  color: #555;
  font-size: 17px;
  margin: 10px 0 0 10px;
`;

function handlePreventDefault(event: React.DragEvent<HTMLDivElement>) {
  event.stopPropagation();
  event.preventDefault();
}

const FolderView: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    handlePreventDefault(event);
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return useObserver(() => {
    const { currentFolder, uploadFiles, getFsObject } = s3.useStore();

    const folderViewItems = currentFolder
      ? currentFolder.childNames.map((fsName: string) => {
          return <FolderViewItem key={fsName} fsObject={getFsObject(fsName)} />;
        })
      : null;

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);
      if (event.dataTransfer) {
        uploadFiles(event.dataTransfer.files).then(result => {
          console.log("result :", result);
        });
      }
    };

    return (
      <Self
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handlePreventDefault}
        onDragLeave={handleDragLeave}
        isUploadReady={isDragOver && currentFolder ? true : false}
      >
        {currentFolder && currentFolder.childNames.length > 0 ? (
          folderViewItems
        ) : (
          <Text>Empty...</Text>
        )}
      </Self>
    );
  });
};

export default FolderView;
