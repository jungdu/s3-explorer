import React from "react";

interface Props {
  loading: boolean;
  bucketNames: Array<string>;
}

const Buckets: React.FC<Props> = ({ loading, bucketNames }) => {
  return (
    <div>
      <h1>Buckets</h1>
      <ul>
        {loading ? (
          <li>Loading...</li>
        ) : (
          bucketNames.map(bucketName => <li key={bucketName}>{bucketName}</li>)
        )}
      </ul>
    </div>
  );
};

export default Buckets;
