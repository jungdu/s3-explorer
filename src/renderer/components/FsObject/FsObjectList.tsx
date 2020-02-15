import React from "react";
import styled, { css } from "styled-components";

import { FsObject, FsType } from "../../types/fs";

const Self = styled.div`
  display: block;
  width: 500px;
  height: 500px;
  border: 1px solid aqua;
`;

const FsObjectItemStyle = css`
  cursor: pointer;
  user-select: none;
`;

const FileItem = styled.li`
  ${FsObjectItemStyle}
`;

const FolderItem = styled.li`
  ${FsObjectItemStyle}
`;

interface Props {
  loading: boolean;
  fsObjects: Array<FsObject>;
  onClickFsObject: (fsObject: FsObject) => void;
}

const FsObjectList: React.FC<Props> = ({
  fsObjects,
  loading,
  onClickFsObject
}) => {
  return (
    <Self>
      <h1>FsObjects</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {fsObjects.map(object =>
            object.type === FsType.FILE ? (
              <FileItem
                key={object.id}
                onClick={() => {
                  onClickFsObject(object);
                }}
              >
                {object.name}
              </FileItem>
            ) : (
              <FolderItem
                key={object.id}
                onClick={() => {
                  onClickFsObject(object);
                }}
              >
                {object.name}
              </FolderItem>
            )
          )}
        </ul>
      )}
    </Self>
  );
};

export default FsObjectList;
