import React from "react";

import { s3 } from "../../stores/connectors";
import Credential from "./Credential";

const CredentialContainer: React.FC = () => {
  const s3Store = s3.useStore();

  return (
    <Credential
      onSetCredential={(accessKeyId, secretAccessKey) => {
        s3Store.setCredential(accessKeyId, secretAccessKey);
      }}
    ></Credential>
  );
};

export default CredentialContainer;
