import React, { useCallback } from "react";
import { useObserver } from "mobx-react";

import { s3 } from "@renderer/context";
import { FsFolder } from "@renderer/types/fs";

import FolderItem from "./FolderItem";

interface Props {
  fsFolder: FsFolder;
}

const FolderItemContainer: React.FC<Props> = ({ fsFolder }) => {
  return useObserver(() => {
    const { openFolder, selecteObject } = s3.useStore();

    const handleOpenFolder = useCallback(() => {
      openFolder(fsFolder);
    }, [fsFolder]);
    const handleClickName = useCallback(() => {
      selecteObject(fsFolder);
    }, [fsFolder]);

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
