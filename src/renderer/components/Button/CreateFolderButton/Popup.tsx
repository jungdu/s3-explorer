import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Self = styled.div`
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0px;
  width: 200px;
  height: 50px;
  padding: 0 10px;
  background-color: rgba(48, 79, 254, 0.9);
`;

const ConfirmButton = styled.button`
  padding: 3px 3px;
  white-space: nowrap;
  margin-left: 10px;
`;

interface Props {
  currentFolderName: string;
  onCreateFolder: (folderName: string) => void;
  onSetPopupShown: (bool: boolean) => void;
}

const Popup: React.FC<Props> = ({
  currentFolderName,
  onCreateFolder,
  onSetPopupShown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>("");

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value);
  };

  const handleClickConfirm = () => {
    if (text.length > 0) {
      onCreateFolder(currentFolderName + text + "/");
      onSetPopupShown(false);
    }
  };

  useEffect(() => {
    const handleClickWindow = () => {
      onSetPopupShown(false);
    };
    window.addEventListener("click", handleClickWindow);

    return () => {
      window.removeEventListener("click", handleClickWindow);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <Self
      onClick={event => {
        event.stopPropagation();
      }}
    >
      <input type="text" ref={inputRef} onChange={handleChangeInput} />
      <ConfirmButton onClick={handleClickConfirm}>확인</ConfirmButton>
    </Self>
  );
};

export default Popup;
