import React, { MouseEvent, useMemo } from "react";
import styled from "styled-components";

import FileSvg from "@renderer/image/file-24px.svg";
import FolderSvg from "@renderer/image/folder_open-24px.svg";
import { FsObject, FsType } from "@renderer/types/fs";

const Self = styled.div`
  width: 100%;
  height: 180px;
  background-color: #ddd;
`;

const Item = styled.div`
  display: inline-block;
  padding: 5px;
  margin: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }
`;

const ItemIcon = styled.div<{ isFolder: boolean }>`
  width: 70px;
  height: 70px;
  margin: 0 auto;
  background-image: url(${props => (props.isFolder ? FolderSvg : FileSvg)});
  background-position: center center;
  background-size: 100% 100%;
`;

const ItemText = styled.div`
  width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
`;

interface Props {
  fsObjects: Array<FsObject>;
  onDoubleClickObject: (fsObject: FsObject) => void;
  onClickObject: (event: MouseEvent, fsObject: FsObject) => void;
}

const FolderView: React.FC<Props> = ({
  fsObjects,
  onDoubleClickObject,
  onClickObject
}) => {
  const items = useMemo(() => {
    console.log("fsObjects :", fsObjects);
    return fsObjects.map(obj => (
      <Item
        key={obj.id}
        onClick={event => {
          onClickObject(event, obj);
        }}
        onDoubleClick={() => {
          onDoubleClickObject(obj);
        }}
      >
        <ItemIcon isFolder={obj.type === FsType.FOLDER} />
        <ItemText>{obj.name}</ItemText>
      </Item>
    ));
  }, [fsObjects]);

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
      <h1> FolderView</h1>
      {items ? items : "선택된 Foldre가 없습니다."}
    </Self>
  );
};

export default FolderView;
