import Popup from "./Popup";
import { actionButtonStyle } from "@renderer/components/Button/constants";
import { s3 } from "@renderer/context";
import IcAddFolder from "@renderer/image/IcAddFolder";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import styled from "styled-components";

const Self = styled.div`
  position: relative;
`;

const ShowPopupButton = styled.button`
  ${actionButtonStyle}
`;

interface Props {
  className?: string;
}

const CreateFolderButton: React.FC<Props> = ({ className }) => {
  const [popupShown, setPopupShown] = useState<boolean>(false);

  return useObserver(() => {
    const { currentFolder, createFolder } = s3.useStore();

    const handleClick = () => {
      setPopupShown(true);
    };

    return (
      <Self className={className} onClick={handleClick}>
        <ShowPopupButton disabled={!currentFolder}>
          <IcAddFolder />
        </ShowPopupButton>
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
