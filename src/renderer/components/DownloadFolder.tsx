import { remote } from "electron";
import React from "react";
import { useObserver } from "mobx-react";
import styled from "styled-components";

import { s3 } from "@renderer/context";

const Self = styled.div`
  margin: 10px 0;
`;
const SetFolderButton = styled.button``;
const DownloadFolderText = styled.div``;

const DownloadDirectory: React.FC = () => {
  return useObserver(() => {
    const { downloadFolder, setDownloadFolder } = s3.useStore();
    const handleClickSetFolderButton = () => {
      remote.dialog
        .showOpenDialog(remote.getCurrentWindow(), {
          properties: ["openDirectory"]
        })
        .then(result => {
          if (result.filePaths && result.filePaths[0]) {
            setDownloadFolder(result.filePaths[0] + "/");
          }
        });
    };

    return (
      <Self>
        <div>Download Settings</div>
        <SetFolderButton onClick={handleClickSetFolderButton}>
          다운로드 폴더
        </SetFolderButton>
        <DownloadFolderText>
          {downloadFolder
            ? downloadFolder
            : "다운로드 할 폴더를 선택해 주세요."}
        </DownloadFolderText>
      </Self>
    );
  });
};

export default DownloadDirectory;
