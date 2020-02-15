import React from "react";
import nanoid from "nanoid";
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
    id: nanoid(),
    name: "music.mp3",
    type: FsType.FILE
  });
  const otherFsObjects: Array<FsObject> = [
    {
      id: nanoid(),
      type: FsType.FOLDER,
      name: "new-folder",
      children: []
    },
    {
      id: nanoid(),
      type: FsType.FOLDER,
      name: "second-folder",
      children: []
    },
    {
      id: nanoid(),
      type: FsType.FOLDER,
      name: "third-folder",
      children: []
    },
    {
      id: nanoid(),
      type: FsType.FOLDER,
      name: "last-folder",
      children: []
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
