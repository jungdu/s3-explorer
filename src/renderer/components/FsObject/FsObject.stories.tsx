import React from "react";
import { action } from "@storybook/addon-actions";
import { boolean, object, withKnobs } from "@storybook/addon-knobs";

import { FsObject, FsType } from "../../types/fs";
import FsObjectList from "./FsObjectList";

export default {
  title: "components|FsObjectList",
  component: FsObjectList,
  decorators: [withKnobs]
};

export const fsObjectList = () => {
  const loading = boolean("loading", false);
  const firstFsObject: FsObject = object("fsObjects[0]", {
    type: FsType.FILE,
    name: "music.mp3"
  });
  const otherFsObjects: Array<FsObject> = [
    {
      type: FsType.FOLDER,
      name: "new-folder"
    },
    {
      type: FsType.FOLDER,
      name: "second-folder"
    },
    {
      type: FsType.FOLDER,
      name: "third-folder"
    },
    {
      type: FsType.FOLDER,
      name: "last-folder"
    }
  ];

  return (
    <FsObjectList
      fsObjects={[firstFsObject, ...otherFsObjects]}
      loading={loading}
      onClickFsObject={action("onClickFsObject")}
    />
  );
};
