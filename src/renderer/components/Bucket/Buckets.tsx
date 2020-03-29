import SideMenu from "@renderer/components/SideMenu";
import React from "react";
import styled from "styled-components";

interface Props {
  bucketNames: Array<string>;
  loading: boolean;
  onBucketClick: (bucketName: string) => void;
}

const Bucket = styled.li`
  height: 35px;
  background-color: #8c9eff;
  color: white;
  font-size: 15px;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
  overflow: hidden;

  & ~ & {
    margin-top: 8px;
  }
`;

const Buckets: React.FC<Props> = ({ bucketNames, loading, onBucketClick }) => {
  return (
    <SideMenu title="Buckets">
      <ul>
        {loading ? (
          <li>Loading...</li>
        ) : (
          bucketNames.map(bucketName => (
            <Bucket
              key={bucketName}
              onClick={() => {
                onBucketClick(bucketName);
              }}
            >
              {bucketName}
            </Bucket>
          ))
        )}
      </ul>
    </SideMenu>
  );
};

export default Buckets;
