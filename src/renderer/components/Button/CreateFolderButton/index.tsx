import { s3 } from "@renderer/context";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import styled from "styled-components";
import Popup from "./Popup";

const Self = styled.div`
  display: inline-block;
  position: relative;
  margin-left: 10px;
  flex-shrink: 0;
`;

const ShowPopupButton = styled.button`
  cursor: pointer;
`;

const CreateFolderButton: React.FC = () => {
  const [popupShown, setPopupShown] = useState<boolean>(false);

  return useObserver(() => {
    const { currentFolder, createFolder } = s3.useStore();

    const handleClick = () => {
      setPopupShown(true);
    };

    return (
      <Self onClick={handleClick}>
        <ShowPopupButton disabled={!currentFolder}>폴더생성</ShowPopupButton>
        {popupShown && currentFolder && (
          <Popup
            currentFolderName={currentFolder.name}
            onSetPopupShown={setPopupShown}
            onCreateFolder={createFolder}
          />
        )}
      </Self>
    );
  });
};

export default CreateFolderButton;
