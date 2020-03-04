import React from "react";
import styled from "styled-components";

import DeleteButton from "./Button/DeleteButton";
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
      <DeleteButton />
    </Self>
  );
};

export default Actions;
