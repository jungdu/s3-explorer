import { CredentialContainer } from "@renderer/components/Credential";
import { default as DownloadDirectoryOrig } from "@renderer/components/DownloadFolder";
import SideMenu from "@renderer/components/SideMenu";
import React from "react";
import styled from "styled-components";

const DownloadDirectory = styled(DownloadDirectoryOrig)`
  margin-top: 20px;
`;

const Settings: React.FC = () => {
  return (
    <SideMenu title="Settings">
      <CredentialContainer />
      <DownloadDirectory />
    </SideMenu>
  );
};

export default Settings;
