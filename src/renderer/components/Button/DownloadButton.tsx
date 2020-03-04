import React, { useCallback } from "react";
import styled from "styled-components";

import { s3 } from "@renderer/context";
import { useObserver } from "mobx-react";

const Self = styled.button`
  cursor: pointer;
  &:active &:hover {
    background-color: #bbb;
  }
`;

const DownloadButtton: React.FC = () => {
  const { downloadSelectedObject, selectedObjects } = s3.useStore();

  const handleOnClick = useCallback(() => {
    downloadSelectedObject();
  }, []);

  return useObserver(() => (
    <Self onClick={handleOnClick} disabled={!!selectedObjects}>
      다운로드
    </Self>
  ));
};

export default DownloadButtton;
