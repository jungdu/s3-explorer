import React, { memo } from "react";
import styled from "styled-components";

import { FsFile } from "../../../types/fs";

const Self = styled.div``;

interface Props {
  fsFile: FsFile;
}

const FileItem: React.FC<Props> = ({ fsFile }) => {
  return <Self>{fsFile.name}</Self>;
};

export default memo(FileItem);
