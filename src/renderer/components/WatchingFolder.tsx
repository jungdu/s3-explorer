import { s3 } from "@renderer/context";
import { useObserver } from "mobx-react";
import React from "react";
import styled from "styled-components";

const Self = styled.div`
  flex-grow: 1;
`;

const Breadcurmb = styled.span`
  color: blue;
  cursor: pointer;
  padding: 0 3px;
  margin: 0 3px;
`;

const WatchingFolder: React.FC = () =>
  useObserver(() => {
    const { currentFolder, openFolderByName } = s3.useStore();

    if (currentFolder) {
      const splitedName = currentFolder.name.split("/").filter(name => !!name);
      const rootPath = (
        <Breadcurmb
          onClick={() => {
            openFolderByName("");
          }}
        >
          /
        </Breadcurmb>
      );
      const breadcrumbs = splitedName.map((folderName, index) => (
        <span key={index}>
          <Breadcurmb
            onClick={() => {
              const fileName = splitedName.splice(0, index + 1).join("/") + "/";
              openFolderByName(fileName);
            }}
          >
            {folderName}
          </Breadcurmb>
          /
        </span>
      ));
      return (
        <Self>
          {rootPath}
          {breadcrumbs}
        </Self>
      );
    }
    return <Self>select bucket</Self>;
  });

export default WatchingFolder;
