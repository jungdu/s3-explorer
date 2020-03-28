import React from "react";
import styled from "styled-components";

const Self = styled.div`
  margin: 23px 0;
`;

const Title = styled.div`
  padding: 5px;
`;

interface Props {
  title: string;
}

const SideMenu: React.FC<Props> = ({ children, title }) => {
  return (
    <Self>
      <Title>{title}</Title>

      {children}
    </Self>
  );
};

export default SideMenu;
