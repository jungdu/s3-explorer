import { s3 } from "@renderer/context";
import IcArchive from "@renderer/image/IcArchive";
import { remote } from "electron";
import { useObserver } from "mobx-react";
import React from "react";
import styled from "styled-components";

const Self = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  background-color: #fff;
  padding: 0px 10px 0px 5px;
  cursor: pointer;
  overflow: hidden;
`;

const ArchiveIcon = styled(IcArchive)`
  flex-shrink: 0;
`;

const FolderName = styled.div`
  flex-grow: 1;
  text-align: right;
  letter-spacing: -0.1em;
  white-space: nowrap;
  overflow: hidden;
  direction: rtl;
  text-overflow: ellipsis;
  padding: 0 2px;
`;

interface Props {
  className?: string;
}

const DownloadDirectory: React.FC<Props> = ({ className }) => {
  return useObserver(() => {
    const { downloadPath, setDownloadPath } = s3.useStore();
    const handleClickSetFolderButton = () => {
      remote.dialog
        .showOpenDialog(remote.getCurrentWindow(), {
          properties: ["openDirectory"],
        })
        .then(result => {
          if (result.filePaths && result.filePaths[0]) {
            setDownloadPath(result.filePaths[0] + "/");
          }
        });
    };

    return (
      <Self className={className} onClick={handleClickSetFolderButton}>
        <ArchiveIcon />
        <FolderName>
          {downloadPath ? downloadPath : "다운로드 할 폴더를 선택해 주세요"}
        </FolderName>
      </Self>
    );
  });
};

export default DownloadDirectory;
