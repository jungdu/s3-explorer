import React from "react";
import styled, { css } from "styled-components";
import Popup, { Props as PopupProps } from "./Popup";

const Buttons = styled.div`
  display: flex;
  margin-top: 32px;
`;

const buttonStyle = css`
  font-size: 12px;
  padding: 7px 10px;
`;

const ConfirmButton = styled.button`
  ${buttonStyle}
  color: #F5F5F5;
  background: ${props => props.theme.color.primaryDark};
  margin: 0 15px 0 auto;
`;

const CancelButton = styled.button`
  ${buttonStyle}
  color: #888888;
  border: 1px solid #888888;
`;

interface Props {
  confirmButtonText?: string;
  onConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ConfirmPopup: React.FC<Props & PopupProps> = ({
  children,
  confirmButtonText = "CONFIRM",
  onConfirm,
  onCancel,
  ...popupProps
}) => {
  return (
    <Popup {...popupProps}>
      {children}
      <Buttons>
        <ConfirmButton onClick={onConfirm}>{confirmButtonText}</ConfirmButton>
        <CancelButton onClick={onCancel}>CANCEL</CancelButton>
      </Buttons>
    </Popup>
  );
};

export default ConfirmPopup;
