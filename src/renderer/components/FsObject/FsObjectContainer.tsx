import React from "react";
import { useObserver } from "mobx-react";

import { s3 } from "../../stores/connectors";
import FsObjects from "./FsObjects";

const FsObjectContainer: React.FC = () => {
  return useObserver(() => {
    const { fsObjects } = s3.useStore();
    // TODO fsObjectNames => fsObjects 형태로 oneDepth로 변경해야함.

    return (
      <FsObjects
        fsObjects={fsObjects}
        loading={false}
        onClickFsObject={() => {}}
      ></FsObjects>
    );
  });
};

export default FsObjectContainer;
