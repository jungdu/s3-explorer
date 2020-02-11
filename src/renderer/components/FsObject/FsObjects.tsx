import React from "react";

import { FsObject } from "../../types/fs";

interface Props {
  loading: boolean;
  fsObjects: Array<FsObject>;
  onClickFsObject: (fsObject: FsObject) => void;
}

const FsObjects: React.FC<Props> = ({
  fsObjects,
  loading,
  onClickFsObject
}) => {
  return (
    <div>
      <h1>FsObjects</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {fsObjects.map(object => (
            <li
              key={object.name}
              onClick={() => {
                onClickFsObject(object);
              }}
            >
              {object.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FsObjects;
