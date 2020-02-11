import React from "react";
import { useObserver } from "mobx-react";

import { s3 } from "../../stores/connectors";
import FsObjects from "./FsObjects";

const FsObjectContainer = useObserver(() => {
  const { fsObjects } = s3.useStore();

  return (
    <FsObjects
      fsObjects={fsObjects}
      loading={false}
      onClickFsObject={() => {}}
    ></FsObjects>
  );
});

export default FsObjectContainer;
