import { BucketContainer } from "@renderer/components/Bucket";
import Settings from "@renderer/components/Settings";
import React from "react";
import styled from "styled-components";

const Self = styled.div`
  flex-basis: 300px;
  flex-shrink: 0;
  background: #f2f2f2;
  overflow: hidden;
`;

const SideBar: React.FC = () => {
  return (
    <Self>
      <Settings></Settings>
      <BucketContainer></BucketContainer>
    </Self>
  );
};

export default SideBar;
