import { s3 } from "@renderer/context";
import { useObserver } from "mobx-react";
import React from "react";
import styled from "styled-components";

const maxBreadcrumLength = 5;

const Self = styled.div`
  overflow: hidden;
  white-space: nowrap;
  padding: 5px 10px;
`;

const Breadcurmb = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: blue;
  padding: 0 3px;
  max-width: 100px;
  margin: 0 3px;
`;

const WatchingFolder: React.FC = () =>
  useObserver(() => {
    const {
      currentFolder,
      openFolderByName,
      openCurrentBucket
    } = s3.useStore();

    if (currentFolder) {
      const splitedName = currentFolder.name.split("/").filter(name => !!name);
      const rootPath = (
        <Breadcurmb
          onClick={() => {
            openCurrentBucket();
          }}
        >
          /
        </Breadcurmb>
      );

      const shrinkedNumber: number =
        splitedName.length > maxBreadcrumLength
          ? splitedName.length - maxBreadcrumLength
          : 0;

      const breadcrumbs = splitedName
        .slice(-maxBreadcrumLength, splitedName.length)
        .map((folderName, index) => (
          <span key={index}>
            <Breadcurmb
              onClick={() => {
                const fileName =
                  splitedName.slice(0, shrinkedNumber + index + 1).join("/") +
                  "/";
                openFolderByName(fileName);
              }}
            >
              {folderName}
            </Breadcurmb>
            /
          </span>
        ));

      const ellipsisPath =
        splitedName.length > maxBreadcrumLength ? <>... /</> : null;

      return (
        <Self>
          {rootPath}
          {ellipsisPath}
          {breadcrumbs}
        </Self>
      );
    }
    return <Self>select bucket</Self>;
  });

export default WatchingFolder;
