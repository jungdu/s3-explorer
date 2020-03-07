import React, { useCallback } from "react";
import styled from "styled-components";

import { s3 } from "@renderer/context";
import { useObserver } from "mobx-react";

const Self = styled.button`
  cursor: pointer;
  flex-shrink: 0;
  &:active &:hover {
    background-color: #bbb;
  }
`;

const DownloadButtton: React.FC = () =>
  useObserver(() => {
    const { downloadSelectedObject, selectedObjects } = s3.useStore();

    const handleOnClick = useCallback(() => {
      downloadSelectedObject();
    }, []);

    return (
      <Self onClick={handleOnClick} disabled={selectedObjects.length === 0}>
        다운로드
      </Self>
    );
  });

export default DownloadButtton;
