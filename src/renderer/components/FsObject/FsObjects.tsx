import React from "react";
import { FsObject } from "../../utils/aws/S3Controller";
interface Props {
  loading: boolean;
  fsObjects: Array<FsObject>;
  onClickFsObject: (idx: number) => void;
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
          {fsObjects.map((object, i) => (
            <li
              key={object.name}
              onClick={() => {
                onClickFsObject(i);
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
