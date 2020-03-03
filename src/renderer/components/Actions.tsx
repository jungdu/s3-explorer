import React from "react";
import styled from "styled-components";

import DownloadButton from "./Button/DownloadButton";

const Self = styled.div`
  display: flex;
  justify-content: baseline;
  align-items: center;
  height: 30px;
  padding: 0px 10px;
`;

const Actions: React.FC = () => {
  return (
    <Self>
      <DownloadButton />
    </Self>
  );
};

export default Actions;
