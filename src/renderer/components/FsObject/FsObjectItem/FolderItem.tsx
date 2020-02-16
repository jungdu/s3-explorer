import React, { memo, useCallback, useMemo } from "react";
import styled from "styled-components";

import { getNameWithoutPath } from "@renderer/utils/format";
import { FsObject } from "@renderer/types/fs";

import FsObjectItem from "../FsObjectItem";

const Self = styled.div``;

const Children = styled.ul`
  padding-left: 15px;
`;

const Icon = styled.span`
  cursor: pointer;
  width: 15px;
  margin-right: 5px;
`;

interface Props {
  name: string;
  fsChildren: Array<FsObject>;
  onOpenFolder: () => void;
}

const FsFolderItem: React.FC<Props> = ({ name, fsChildren, onOpenFolder }) => {
  const displayedName = useMemo(() => getNameWithoutPath(name), [name]);
  const handleIconCliked = useCallback(() => {
    onOpenFolder();
  }, [onOpenFolder]);

  return (
    <>
      <Self>
        <Icon onClick={handleIconCliked}>
          {fsChildren.length > 0 ? <>&darr;</> : <>&rarr;</>}
        </Icon>
        {displayedName}
      </Self>
      <Children>
        {fsChildren.map(fsObject => (
          <FsObjectItem key={fsObject.id} fsObject={fsObject} />
        ))}
      </Children>
    </>
  );
};

export default memo(FsFolderItem);
