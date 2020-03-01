import React, { useCallback } from "react";
import styled from "styled-components";

import { s3 } from "@renderer/context";

const Self = styled.button``;

const DownloadButtton: React.FC = () => {
  const { downloadSelectedObject } = s3.useStore();

  const handleOnClick = useCallback(() => {
    downloadSelectedObject();
  }, []);

  return <Self onClick={handleOnClick}>⬇️</Self>;
};

export default DownloadButtton;
