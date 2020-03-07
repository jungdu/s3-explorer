import React from "react";
import { useObserver } from "mobx-react";
import styled from "styled-components";

import { s3 } from "@renderer/context";

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

const FolderView: React.FC = () =>
  useObserver(() => {
    const { currentFolder, uploadFiles, getFsObject } = s3.useStore();

    const folderViewItems = currentFolder
      ? currentFolder.childNames.map((fsName: string) => {
          return <FolderViewItem key={fsName} fsObject={getFsObject(fsName)} />;
        })
      : null;

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        uploadFiles(event.dataTransfer.files).then(result => {
          console.log("result :", result);
        });
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
        {currentFolder && currentFolder.childNames.length > 0 ? (
          folderViewItems
        ) : (
          <Text>Empty...</Text>
        )}
      </Self>
    );
  });

export default FolderView;
