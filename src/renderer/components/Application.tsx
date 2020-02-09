import React from "react";

import { BucketContainer } from "./Bucket";
import { CredentialContainer } from "./Credential";
import { FsObjectContainer } from "./FsObject";
import GlobalStyles from "./GlobalStyles";

const Application: React.FC = () => (
  <>
    <GlobalStyles />
    <CredentialContainer></CredentialContainer>
    <BucketContainer></BucketContainer>
    <FsObjectContainer></FsObjectContainer>
  </>
);

export default Application;
