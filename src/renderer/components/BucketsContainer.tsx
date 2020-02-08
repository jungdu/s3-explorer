import React from "react";
import Buckets from "./Buckets";

const BucketsContainer: React.FC = () => {
  return <Buckets bucketNames={["image", "mp3", "videos"]}></Buckets>;
};

export default BucketsContainer;
