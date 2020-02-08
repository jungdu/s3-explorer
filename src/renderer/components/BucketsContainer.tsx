import React from "react";
import { useObserver } from "mobx-react";

import { s3 } from "../stores/connectors";
import Buckets from "./Buckets";

const BucketsContainer: React.FC = () => {
  const s3Store = s3.useStore();

  return useObserver(() => (
    <Buckets bucketNames={s3Store.bucketNames}></Buckets>
  ));
};

export default BucketsContainer;
