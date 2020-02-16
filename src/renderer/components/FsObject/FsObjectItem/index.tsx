import React, { memo } from "react";

import { isFolder, FsObject } from "@renderer/types/fs";

import FileItem from "./FileItem";
import FolderItemContainer from "./FolderItemContainer";

interface Props {
  fsObject: FsObject;
}

const FsObjectItem: React.FC<Props> = ({ fsObject }) => {
  return isFolder(fsObject) ? (
    <FolderItemContainer fsFolder={fsObject} />
  ) : (
    <FileItem fsFile={fsObject} />
  );
};

export default memo(FsObjectItem);
