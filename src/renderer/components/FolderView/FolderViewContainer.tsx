import React from "react";
import { useObserver } from "mobx-react";

import { s3 } from "@renderer/context";

import FolderView from "./FolderView";

const FolderViewContainer: React.FC = () => {
  return useObserver(() => {
    const { filesInFolderView } = s3.useStore();

    return <FolderView fsObjects={filesInFolderView} />;
  });
};

export default FolderViewContainer;
