import React, { useCallback } from "react";
import { useObserver } from "mobx-react";

import { s3 } from "@renderer/context";
import { FsFile } from "@renderer/types/fs";

import FileItem from "./FileItem";

interface Props {
  fsFile: FsFile;
}

const FileItemContainer: React.FC<Props> = ({ fsFile }) => {
  return useObserver(() => {
    const { selecteObject } = s3.useStore();

    const handleClickName = useCallback(() => {
      selecteObject(fsFile);
    }, [fsFile]);

    return (
      <FileItem
        name={fsFile.name}
        selected={!!fsFile.selected}
        onClickName={handleClickName}
      />
    );
  });
};

export default FileItemContainer;
