import React from "react";
import { withKnobs, array } from "@storybook/addon-knobs";

import Buckets from "./Buckets";

export default {
  title: "components|Buckets",
  component: Buckets,
  decorators: [withKnobs]
};

export const buckets = () => {
  const bucketNames = array("bucketNames", ["bucket1", "bucket2", "bucket3"]);

  return <Buckets bucketNames={bucketNames}></Buckets>;
};
