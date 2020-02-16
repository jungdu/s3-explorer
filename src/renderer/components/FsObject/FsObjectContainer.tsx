import React from "react";
import { useObserver } from "mobx-react";

import { s3 } from "../../context";
import FsObjectList from "./FsObjectList";

const FsObjectContainer: React.FC = () =>
  useObserver(() => {
    const { fsObjects } = s3.useStore();

    return <FsObjectList fsObjects={fsObjects} loading={false} />;
  });

export default FsObjectContainer;
