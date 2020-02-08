import React from "react";

interface Props {
  bucketNames: Array<string>;
}

const Buckets: React.FC<Props> = ({ bucketNames }) => {
  return (
    <div>
      <h1>Buckets</h1>
      <ul>
        {bucketNames.map(bucketName => (
          <li key={bucketName}>{bucketName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Buckets;
