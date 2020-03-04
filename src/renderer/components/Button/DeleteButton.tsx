import React, { useCallback } from "react";
import styled from "styled-components";

import { s3 } from "@renderer/context";
import { useObserver } from "mobx-react";

const Self = styled.button`
  cursor: pointer;
  margin-left: 10px;
  &:active &:hover {
    background-color: #bbb;
  }
`;

const DeleteButton: React.FC = () =>
  useObserver(() => {
    const { deleteSelectedObjects, selectedObjects } = s3.useStore();

    const handleOnClick = useCallback(() => {
      deleteSelectedObjects();
    }, []);

    return (
      <Self onClick={handleOnClick} disabled={selectedObjects.length === 0}>
        삭제
      </Self>
    );
  });

export default DeleteButton;
