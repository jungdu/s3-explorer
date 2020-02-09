import React from "react";

import { BucketContainer } from "./Bucket";
import { CredentialContainer } from "./Credential";
import GlobalStyles from "./GlobalStyles";

const Application: React.FC = () => (
  <>
    <GlobalStyles />
    <CredentialContainer></CredentialContainer>
    <BucketContainer></BucketContainer>
  </>
);

export default Application;
