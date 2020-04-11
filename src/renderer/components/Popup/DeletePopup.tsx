import { s3 } from "@renderer/context";
import { useObserver } from "mobx-react";
import React from "react";
import styled from "styled-components";
import ConfirmPopup from "./ConfirmPopup";

const Description = styled.div`
  color: ${props => props.theme.color.fontSecondary};
`;

const Count = styled.span`
  color: red;
`;

interface Props {
  hidePopup: () => void;
  shown: boolean;
}

const DeletePopup: React.FC<Props> = ({ hidePopup, shown }) => {
  const handleCancel = () => {
    hidePopup();
  };

  return useObserver(() => {
    const { selectedObjects, deleteSelectedObjects } = s3.useStore();
    const handleConfirm = () => {
      deleteSelectedObjects();
      hidePopup();
    };

    return (
      <ConfirmPopup
        confirmButtonText="DELETE"
        shown={shown}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="파일을 삭제 하시겠습니까?"
      >
        <Description>
          선택된 파일 <Count>{selectedObjects.length}</Count>개
        </Description>
      </ConfirmPopup>
    );
  });
};

export default DeletePopup;
