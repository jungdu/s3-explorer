import React from "react";
import styled from "styled-components";

import DownloadButton from "@renderer/components/Button/DownloadButton";
import DownloadDirectory from "@renderer/components/DownloadFolder";
import { FsObject } from "@renderer/types/fs";

import FsObjectItem from "./FsObjectItem";

const Self = styled.div`
  display: block;
  width: 500px;
  height: 500px;
  border: 1px solid aqua;
`;

interface Props {
  loading: boolean;
  fsObjects: Array<FsObject>;
}

const FsObjectList: React.FC<Props> = ({ fsObjects, loading }) => {
  return (
    <Self>
      <DownloadDirectory />
      <h1>
        FsObjects <DownloadButton />
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {fsObjects.map(object => (
            <FsObjectItem key={object.id} fsObject={object} />
          ))}
        </ul>
      )}
    </Self>
  );
};

export default FsObjectList;
