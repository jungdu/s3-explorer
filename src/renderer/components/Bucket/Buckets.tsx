import React from "react";

interface Props {
  bucketNames: Array<string>;
  loading: boolean;
  onBucketClick: (bucketName: string) => void;
}

const Buckets: React.FC<Props> = ({ bucketNames, loading, onBucketClick }) => {
  return (
    <div>
      <h1>Buckets</h1>
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
    </div>
  );
};

export default Buckets;
