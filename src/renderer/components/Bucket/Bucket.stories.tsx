import React from "react";
import { array, boolean, withKnobs } from "@storybook/addon-knobs";

import Buckets from "./Buckets";

export default {
  title: "components|Buckets",
  component: Buckets,
  decorators: [withKnobs]
};

export const buckets = () => {
  const bucketLoading = boolean("bucketLoading", false);
  const bucketNames = array("bucketNames", ["bucket1", "bucket2", "bucket3"]);

  return (
    <Buckets bucketNames={bucketNames} bucketLoading={bucketLoading}></Buckets>
  );
};
