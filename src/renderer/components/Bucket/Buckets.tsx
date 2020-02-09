import React from "react";

interface Props {
  bucketLoading: boolean;
  bucketNames: Array<string>;
}

const Buckets: React.FC<Props> = ({ bucketLoading, bucketNames }) => {
  return (
    <div>
      <h1>Buckets</h1>
      <ul>
        {bucketLoading ? (
          <li>Loading...</li>
        ) : (
          bucketNames.map(bucketName => <li key={bucketName}>{bucketName}</li>)
        )}
      </ul>
    </div>
  );
};

export default Buckets;
