import React from "react";

import Actions from "@renderer/components/Actions";
import { BucketContainer } from "@renderer/components/Bucket";
import { CredentialContainer } from "@renderer/components/Credential";
import DownloadDirectory from "@renderer/components/DownloadFolder";
import FolderView from "@renderer/components/FolderView";
import GlobalStyles from "@renderer/components/GlobalStyles";

const Application: React.FC = () => (
  <>
    <GlobalStyles />
    <CredentialContainer></CredentialContainer>
    <BucketContainer></BucketContainer>
    <DownloadDirectory></DownloadDirectory>
    <Actions></Actions>
    <FolderView></FolderView>
  </>
);

export default Application;
