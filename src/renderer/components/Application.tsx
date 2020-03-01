import React from "react";

import { BucketContainer } from "@renderer/components/Bucket";
import { CredentialContainer } from "@renderer/components/Credential";
import DownloadDirectory from "@renderer/components/DownloadFolder";
import { FsObjectContainer } from "@renderer/components/FsObject";
import GlobalStyles from "@renderer/components/GlobalStyles";

const Application: React.FC = () => (
  <>
    <GlobalStyles />
    <CredentialContainer></CredentialContainer>
    <BucketContainer></BucketContainer>
    <DownloadDirectory></DownloadDirectory>
    <FsObjectContainer></FsObjectContainer>
  </>
);

export default Application;
