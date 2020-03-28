import React from "react";
import styled from "styled-components";

const Self = styled.div`
  padding: 30px 30px 0px;
`;

const Title = styled.div`
  font-size: 15px;
  letter-spacing: 0.2em;
  margin-bottom: 20px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #000;
  margin: 30px auto 0px;
`;

interface Props {
  title: string;
}

const SideMenu: React.FC<Props> = ({ children, title }) => {
  return (
    <Self>
      <Title>{title}</Title>
      {children}
      <Divider />
    </Self>
  );
};

export default SideMenu;
