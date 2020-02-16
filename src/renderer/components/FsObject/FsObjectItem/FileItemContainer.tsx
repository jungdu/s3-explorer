import React, { useCallback, MouseEventHandler } from "react";
import { useObserver } from "mobx-react";

import { s3 } from "@renderer/context";
import { FsFile } from "@renderer/types/fs";

import FileItem from "./FileItem";

interface Props {
  fsFile: FsFile;
}

const FileItemContainer: React.FC<Props> = ({ fsFile }) => {
  return useObserver(() => {
    const { addSelectedObject, deselectObject, selecteObject } = s3.useStore();

    const handleClickName: MouseEventHandler = useCallback(
      event => {
        if (event.altKey) {
          if (fsFile.selected) {
            deselectObject(fsFile);
          } else {
            addSelectedObject(fsFile);
          }
        } else {
          selecteObject(fsFile);
        }
      },
      [fsFile]
    );

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
