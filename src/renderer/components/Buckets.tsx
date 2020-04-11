import SideMenu from "@renderer/components/SideMenu";
import { s3 } from "@renderer/context";
import { useObserver } from "mobx-react";
import React from "react";
import styled from "styled-components";

const Bucket = styled.li<{ selected: boolean }>`
  height: 35px;
  background-color: ${props =>
    props.selected ? props.theme.color.primaryDark : props.theme.color.primary};
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

const Buckets: React.FC = () =>
  useObserver(() => {
    const {
      bucketNames,
      bucketLoading,
      currentBucket,
      selectBucket,
    } = s3.useStore();

    return (
      <SideMenu title="Buckets">
        <ul>
          {bucketLoading ? (
            <li>Loading...</li>
          ) : (
            bucketNames.map(bucketName => (
              <Bucket
                key={bucketName}
                onClick={() => {
                  selectBucket(bucketName);
                }}
                selected={bucketName === currentBucket}
              >
                {bucketName}
              </Bucket>
            ))
          )}
        </ul>
      </SideMenu>
    );
  });

export default Buckets;
