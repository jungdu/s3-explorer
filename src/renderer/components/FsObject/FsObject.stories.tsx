import React from "react";
import nanoid from "nanoid";
import { boolean, object, withKnobs } from "@storybook/addon-knobs";

import { s3 } from "../../stores";
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
      children: [
        {
          id: nanoid(),
          name: "video.mp4",
          type: FsType.FILE
        },
        {
          id: nanoid(),
          name: "audio.mp3",
          type: FsType.FILE
        }
      ]
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
    <s3.Provider>
      <FsObjectList
        fsObjects={[firstFsObject, ...otherFsObjects]}
        loading={loading}
      />
    </s3.Provider>
  );
};
