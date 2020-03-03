import React, { useCallback } from "react";
import styled from "styled-components";

import { s3 } from "@renderer/context";

const Self = styled.button`
  cursor: pointer;
  &:hover {
    background-color: #bbb;
  }
`;

const DownloadButtton: React.FC = () => {
  const { downloadSelectedObject } = s3.useStore();

  const handleOnClick = useCallback(() => {
    downloadSelectedObject();
  }, []);

  return <Self onClick={handleOnClick}>다운로드</Self>;
};

export default DownloadButtton;
