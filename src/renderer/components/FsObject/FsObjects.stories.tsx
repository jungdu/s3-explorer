import React from "react";
import { action } from "@storybook/addon-actions";
import { object, boolean, withKnobs } from "@storybook/addon-knobs";

import { FsType, FsObject } from "../../types/fs";
import FsObjects from "./FsObjects";

export default {
  title: "components|FsObjects",
  component: FsObjects,
  decorators: [withKnobs]
};

export const fsObjects = () => {
  const loading = boolean("loading", false);
  const firstFsObject: FsObject = object("fsObjects[0]", {
    type: FsType.FILE,
    name: "music.mp3"
  });

  return (
    <FsObjects
      fsObjects={[firstFsObject]}
      loading={loading}
      onClickFsObject={action("onClickFsObject")}
    ></FsObjects>
  );
};
