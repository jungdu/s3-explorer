import React from "react";
import { action } from "@storybook/addon-actions";
import { array, boolean, withKnobs } from "@storybook/addon-knobs";

import Buckets from "./Buckets";

export default {
  title: "components|Buckets",
  component: Buckets,
  decorators: [withKnobs]
};

export const buckets = () => {
  const bucketNames = array("bucketNames", ["bucket1", "bucket2", "bucket3"]);
  const loading = boolean("loading", false);

  return (
    <Buckets
      bucketNames={bucketNames}
      loading={loading}
      onBucketClick={action("onBucketClick")}
    ></Buckets>
  );
};
