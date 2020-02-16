import React, { memo } from "react";

import { isFolder, FsObject } from "@renderer/types/fs";

import FileItemContainer from "./FileItemContainer";
import FolderItemContainer from "./FolderItemContainer";

interface Props {
  fsObject: FsObject;
}

const FsObjectItem: React.FC<Props> = ({ fsObject }) => {
  return isFolder(fsObject) ? (
    <FolderItemContainer fsFolder={fsObject} />
  ) : (
    <FileItemContainer fsFile={fsObject} />
  );
};

export default memo(FsObjectItem);
