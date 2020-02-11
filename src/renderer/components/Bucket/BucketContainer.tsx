import React from "react";
import { useObserver } from "mobx-react";

import { s3 } from "../../stores/connectors";
import Buckets from "./Buckets";

const BucketsContainer = useObserver(() => {
  const { bucketNames, loading, selectBucket } = s3.useStore();

  return (
    <Buckets
      bucketNames={bucketNames}
      loading={loading}
      onBucketClick={bucketName => {
        selectBucket(bucketName);
      }}
    ></Buckets>
  );
});

export default BucketsContainer;
