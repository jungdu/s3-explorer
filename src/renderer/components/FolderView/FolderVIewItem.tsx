import { getNameWithoutPath } from "@common/utils/format";
import { s3 } from "@renderer/context";
import FileSvg from "@renderer/image/file-24px.svg";
import FolderSvg from "@renderer/image/folder_open-24px.svg";
import { FsObject, FsType } from "@renderer/types/fs";
import { useObserver } from "mobx-react";
import React, { MouseEventHandler } from "react";
import styled, { css } from "styled-components";

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

const Item = styled.div<{ selected: boolean }>`
  position: relative;
  display: inline-block;
  padding: 5px 0;
  margin: 4px 4px 0 4px;
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
  padding: 0 3px;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
`;

export interface Props {
  fsObject: FsObject;
}

const FolderViewItem: React.FC<Props> = ({ fsObject }) =>
  useObserver(() => {
    const {
      addSelectedObject,
      deselectObject,
      openFolder,
      selectObject,
    } = s3.useStore();

    const handleClick: MouseEventHandler = (event): void => {
      if (event.altKey) {
        if (fsObject.selected) {
          deselectObject(fsObject);
        } else {
          addSelectedObject(fsObject);
        }
      } else {
        selectObject(fsObject);
      }
    };
    const handleDoubleClick = () => {
      if (fsObject.type === FsType.FOLDER) {
        openFolder(fsObject);
      }
    };

    return (
      <Item
        selected={fsObject.selected ? true : false}
        key={fsObject.id}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <ItemIcon isFolder={fsObject.type === FsType.FOLDER} />
        <ItemText>{getNameWithoutPath(fsObject.name)}</ItemText>
      </Item>
    );
  });

export default FolderViewItem;
