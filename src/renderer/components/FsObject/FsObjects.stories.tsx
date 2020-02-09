import React from "react";
import { action } from "@storybook/addon-actions";
import { array, boolean, withKnobs } from "@storybook/addon-knobs";

import FsObjects from "./FsObjects";

export default {
  title: "components|FsObjects",
  component: FsObjects,
  decorators: [withKnobs]
};

export const fsObjects = () => {
  const loading = boolean("loading", false);
  const fsObjectNames = array("fsObjectNames", [
    "name.txt",
    "song.mp3",
    "video.mp4"
  ]);

  return (
    <FsObjects
      fsObjectNames={fsObjectNames}
      loading={loading}
      onClickFsObject={action("onClickFsObject")}
    ></FsObjects>
  );
};
