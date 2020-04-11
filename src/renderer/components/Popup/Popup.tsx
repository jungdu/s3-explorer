import React from "react";
import styled from "styled-components";
import PopupPortal from "./PopupPortal";

const Self = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 360px;
  padding: 30px;
  box-shadow: 5px 5px 25px rgba(123, 123, 123, 0.9);
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 1;
`;

const Title = styled.div`
  color: #444444;
  font-size: 25px;
  margin-bottom: 18px;
`;

export interface Props {
  title?: string;
  shown: boolean;
}

const Popup: React.FC<Props> = ({ children, shown, title }) => {
  return (
    <>
      {shown && (
        <PopupPortal>
          <Self>
            <Title>{title}</Title>
            {children}
          </Self>
        </PopupPortal>
      )}
    </>
  );
};

export default Popup;
