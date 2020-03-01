import React from "react";
import { useObserver } from "mobx-react";

import { s3 } from "@renderer/context";
import { FsObject, FsType } from "@renderer/types/fs";

import FolderView from "./FolderView";

const FolderViewContainer: React.FC = () =>
  useObserver(() => {
    const { filesInFolderView, openFolder } = s3.useStore();
    const handleDoubleClickObject = (fsObject: FsObject) => {
      if (fsObject.type === FsType.FOLDER) {
        openFolder(fsObject);
      }
    };
    // const handleClickObject = (event: MouseEvent, fsObject: FsObject) => {
    // TODO 선택 가능하도록 추가!
    // };
    const handleClickObject = () => {};

    return (
      <FolderView
        fsObjects={filesInFolderView}
        onClickObject={handleClickObject}
        onDoubleClickObject={handleDoubleClickObject}
      />
    );
  });

export default FolderViewContainer;
