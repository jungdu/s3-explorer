import React from "react";
import { useObserver } from "mobx-react";

import { s3 } from "../../stores/connectors";
import FsObjects from "./FsObjects";

const FsObjectContainer: React.FC = () => {
  return useObserver(() => {
    const s3Store = s3.useStore();
    // TODO fsObjectNames => fsObjects 형태로 oneDepth로 변경해야함.

    const fsObjectNames = [
      ...s3Store.fsObjectNames.fileNames,
      ...s3Store.fsObjectNames.folderNames
    ];

    return (
      <FsObjects
        fsObjectNames={fsObjectNames}
        loading={false}
        onClickFsObject={() => {}}
      ></FsObjects>
    );
  });
};

export default FsObjectContainer;
