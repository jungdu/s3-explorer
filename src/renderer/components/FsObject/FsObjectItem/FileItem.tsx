import React, { memo, useMemo } from "react";
import styled from "styled-components";

import { FsFile } from "@renderer/types/fs";
import { getNameWithoutPath } from "@renderer/utils/format";

import { itemNameStyle } from "./constant";

const Self = styled.div``;

const Name = styled.span`
  ${itemNameStyle}
  margin-left: 20px;
`;

interface Props {
  fsFile: FsFile;
}

const FileItem: React.FC<Props> = ({ fsFile }) => {
  const displayedName = useMemo(() => getNameWithoutPath(fsFile.name), [
    fsFile.name
  ]);

  return (
    <Self>
      <Name>{displayedName}</Name>
    </Self>
  );
};

export default memo(FileItem);
