import React, { MouseEvent, useMemo } from "react";
import styled, { css } from "styled-components";

import FileSvg from "@renderer/image/file-24px.svg";
import FolderSvg from "@renderer/image/folder_open-24px.svg";
import { FsObject, FsType } from "@renderer/types/fs";

const selectedItemStyle = css`
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 255, 0.2);
  }
`;

const Self = styled.div`
  width: 100%;
  height: 300px;
`;

const Item = styled.div<{ selected: boolean }>`
  position: relative;
  display: inline-block;
  padding: 5px;
  margin: 0 4px 4px;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }

  ${props => (props.selected ? selectedItemStyle : "")}
`;

const ItemIcon = styled.div<{ isFolder: boolean }>`
  width: 60px;
  height: 60px;
  margin: 0 auto;
  background-image: url(${props => (props.isFolder ? FolderSvg : FileSvg)});
  background-position: center center;
  background-size: 100% 100%;
`;

const ItemText = styled.div`
  display: -webkit-box;
  width: 100px;
  height: 28px;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
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
        selected={obj.selected ? true : false}
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
