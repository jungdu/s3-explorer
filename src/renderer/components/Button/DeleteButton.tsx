import React, { useCallback } from "react";
import styled from "styled-components";
import { s3 } from "@renderer/context";
import { useObserver } from "mobx-react";
import { actionButtonStyle } from "./constants";
import IcDelete from "@renderer/image/IcDelete";

const Self = styled.button`
  ${actionButtonStyle}
`;

interface Props {
  className?: string;
}

const DeleteButton: React.FC<Props> = ({ className }) =>
  useObserver(() => {
    const { deleteSelectedObjects, selectedObjects } = s3.useStore();

    const handleOnClick = useCallback(() => {
      deleteSelectedObjects();
    }, []);

    return (
      <Self
        className={className}
        onClick={handleOnClick}
        disabled={selectedObjects.length === 0}
      >
        <IcDelete />
      </Self>
    );
  });

export default DeleteButton;
