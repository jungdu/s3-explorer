import React, { memo, useMemo } from "react";
import styled from "styled-components";

import { getNameWithoutPath } from "@renderer/utils/format";

import { itemNameStyle } from "./constant";

const Self = styled.div``;

const Name = styled.span`
  ${itemNameStyle}
  margin-left: 20px;
`;

interface Props {
  name: string;
  selected: boolean;
  onClickName: () => void;
}

const FileItem: React.FC<Props> = ({ name, selected, onClickName }) => {
  const displayedName = useMemo(() => getNameWithoutPath(name), [name]);

  return (
    <Self>
      <Name onClick={onClickName}>
        {displayedName} {selected ? "선택!" : ""}
      </Name>
    </Self>
  );
};

export default memo(FileItem);
