import React from "react";
import styled from "styled-components";

import PopupPortal from "./PopupPortal";

const Self = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  padding: 30px;
  box-shadow: 5px 5px 25px rgba(123, 123, 123, 0.9);
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  transform: translate(-50%, -50%);
  background: #ededed;
  z-index: 1;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
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
          <Background>
            <Self>
              <Title>{title}</Title>
              {children}
            </Self>
          </Background>
        </PopupPortal>
      )}
    </>
  );
};

export default Popup;
