import React from "react";
import styled from "styled-components";
import { BucketContainer } from "@renderer/components/Bucket";
import { CredentialContainer } from "@renderer/components/Credential";
import DownloadDirectory from "@renderer/components/DownloadFolder";

const Self = styled.div`
  flex-basis: 300px;
  flex-shrink: 0;
  overflow: hidden;
`;

const SideBar: React.FC = () => {
  return (
    <Self>
      <CredentialContainer></CredentialContainer>
      <DownloadDirectory></DownloadDirectory>
      <BucketContainer></BucketContainer>
    </Self>
  );
};

export default SideBar;
