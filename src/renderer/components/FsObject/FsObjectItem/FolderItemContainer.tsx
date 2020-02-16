import React, { useCallback } from "react";

import { FsFolder } from "../../../types/fs";

import { s3 } from "../../../stores";
import FolderItem from "./FolderItem";
import { useObserver } from "mobx-react";

interface Props {
  fsFolder: FsFolder;
}

const FolderItemContainer: React.FC<Props> = ({ fsFolder }) => {
  return useObserver(() => {
    const { openFolder } = s3.useStore();
    const handleOpenFolder = useCallback(() => {
      openFolder(fsFolder);
    }, [fsFolder]);

    return (
      <FolderItem
        name={fsFolder.name}
        fsChildren={fsFolder.children}
        onOpenFolder={handleOpenFolder}
      />
    );
  });
};

export default FolderItemContainer;
