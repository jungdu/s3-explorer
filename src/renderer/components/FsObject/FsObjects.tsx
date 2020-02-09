import React from "react";

interface Props {
  loading: boolean;
  fsObjectNames: Array<string>;
  onClickFsObject: (idx: number) => void;
}

const FsObjects: React.FC<Props> = ({
  fsObjectNames,
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
          {fsObjectNames.map((objectName, i) => (
            <li
              key={objectName}
              onClick={() => {
                onClickFsObject(i);
              }}
            >
              {objectName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FsObjects;
