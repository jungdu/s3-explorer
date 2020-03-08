import GlobalStyles from "@renderer/components/GlobalStyles";
import MainSection from "@renderer/components/MainSection";
import SideBar from "@renderer/components/SideBar";
import React from "react";
import styled from "styled-components";

const Self = styled.div`
  display: flex;
  overflow-y: hidden;
  min-height: 100%;
`;

const Application: React.FC = () => (
  <Self>
    <GlobalStyles />
    <SideBar />
    <MainSection />
  </Self>
);

export default Application;
