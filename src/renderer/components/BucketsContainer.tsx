import React from "react";
import { useObserver } from "mobx-react";

import { useS3Store } from "../stores/s3";
import Buckets from "./Buckets";

const BucketsContainer: React.FC = () => {
  const s3Store = useS3Store();

  return useObserver(() => (
    <Buckets bucketNames={s3Store.bucketNames}></Buckets>
  ));
};

export default BucketsContainer;
