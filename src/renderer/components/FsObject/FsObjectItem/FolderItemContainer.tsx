import React, { useCallback, MouseEventHandler } from "react";
import { useObserver } from "mobx-react";

import { s3 } from "@renderer/context";
import { FsFolder } from "@renderer/types/fs";

import FolderItem from "./FolderItem";

interface Props {
  fsFolder: FsFolder;
}

const FolderItemContainer: React.FC<Props> = ({ fsFolder }) => {
  return useObserver(() => {
    const {
      addSelectedObject,
      deselectObject,
      openFolder,
      selecteObject
    } = s3.useStore();

    const handleOpenFolder = useCallback(() => {
      openFolder(fsFolder);
    }, [fsFolder]);
    const handleClickName: MouseEventHandler = useCallback(
      event => {
        if (event.altKey) {
          if (fsFolder.selected) {
            deselectObject(fsFolder);
          } else {
            addSelectedObject(fsFolder);
          }
        } else {
          selecteObject(fsFolder);
        }
      },
      [fsFolder]
    );

    return (
      <FolderItem
        name={fsFolder.name}
        fsChildren={fsFolder.children}
        selected={!!fsFolder.selected}
        onClickName={handleClickName}
        onOpenFolder={handleOpenFolder}
      />
    );
  });
};

export default FolderItemContainer;
