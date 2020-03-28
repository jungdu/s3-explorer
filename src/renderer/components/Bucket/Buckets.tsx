import SideMenu from "@renderer/components/SideMenu";
import React from "react";

interface Props {
  bucketNames: Array<string>;
  loading: boolean;
  onBucketClick: (bucketName: string) => void;
}

const Buckets: React.FC<Props> = ({ bucketNames, loading, onBucketClick }) => {
  return (
    <SideMenu title="Buckets">
      <ul>
        {loading ? (
          <li>Loading...</li>
        ) : (
          bucketNames.map(bucketName => (
            <li
              key={bucketName}
              onClick={() => {
                onBucketClick(bucketName);
              }}
            >
              {bucketName}
            </li>
          ))
        )}
      </ul>
    </SideMenu>
  );
};

export default Buckets;
