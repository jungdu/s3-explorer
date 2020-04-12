import ToolTip from "@renderer/components/Tooltip";
import { s3 } from "@renderer/context";
import IcDownload from "@renderer/image/IcDownload";
import { useObserver } from "mobx-react";
import React, { useCallback } from "react";
import styled from "styled-components";
import { actionButtonStyle } from "./constants";

const Self = styled.button`
  ${actionButtonStyle}
`;

interface Props {
  className?: string;
}

const DownloadButtton: React.FC<Props> = ({ className }) =>
  useObserver(() => {
    const { downloadSelectedObjects, selectedObjects } = s3.useStore();
    const disalbed = selectedObjects.length === 0;

    const handleOnClick = useCallback(() => {
      downloadSelectedObjects();
    }, []);

    return (
      <Self
        className={className}
        onClick={handleOnClick}
        disabled={selectedObjects.length === 0}
      >
        {!disalbed && <ToolTip direction="BOTTOM">DELETE</ToolTip>}
        <IcDownload />
      </Self>
    );
  });

export default DownloadButtton;
