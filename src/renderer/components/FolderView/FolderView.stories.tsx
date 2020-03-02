import React from "react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";

import { FsObject, FsType } from "../../types/fs";

import FolderView from "./FolderView";
import nanoid from "nanoid";

export default {
  title: "components|FolderView",
  component: FolderView,
  decorators: [withKnobs]
};

export const folderView = () => {
  const fsObjects: Array<FsObject> = [
    {
      id: nanoid(),
      name: "hello.txt",
      type: FsType.FILE
    },
    {
      id: nanoid(),
      name: "sample-video-1920x820.mp4",
      type: FsType.FILE,
      selected: true
    },
    {
      id: nanoid(),
      name: "hello-hello-hellooooooooooooo/",
      type: FsType.FOLDER,
      children: []
    },
    {
      id: nanoid(),
      name: "something-important",
      type: FsType.FOLDER,
      children: []
    }
  ];

  return (
    <FolderView
      fsObjects={fsObjects}
      onClickObject={action("onClickObject")}
      onDoubleClickObject={action("onDoubleClickObject")}
    ></FolderView>
  );
};
