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

interface Props {
  className?: string;
}

const DownloadButtton: React.FC<Props> = ({ className }) =>
  useObserver(() => {
    const { downloadSelectedObject, selectedObjects } = s3.useStore();

    const handleOnClick = useCallback(() => {
      downloadSelectedObject();
    }, []);

    return (
      <Self
        className={className}
        onClick={handleOnClick}
        disabled={selectedObjects.length === 0}
      >
        다운로드
      </Self>
    );
  });

export default DownloadButtton;
