import { remote } from "electron";
import React from "react";
import { useObserver } from "mobx-react";
import styled from "styled-components";

import { s3 } from "@renderer/context";

const Self = styled.div``;
const SetFolderButton = styled.button``;

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
        <SetFolderButton onClick={handleClickSetFolderButton}>
          다운로드 폴더 📁
        </SetFolderButton>
        :{downloadFolder ? downloadFolder : "다운로드 할 폴더를 선택해 주세요."}
      </Self>
    );
  });
};

export default DownloadDirectory;
