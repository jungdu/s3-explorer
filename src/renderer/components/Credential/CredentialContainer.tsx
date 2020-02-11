import React from "react";

import { s3 } from "../../stores/connectors";
import Credential from "./Credential";
import { observer } from "mobx-react";

const CredentialContainer = observer(() => {
  const { setCredential } = s3.useStore();
  return (
    <Credential
      onSetCredential={(accessKeyId, secretAccessKey) => {
        setCredential(accessKeyId, secretAccessKey);
      }}
    ></Credential>
  );
});

export default CredentialContainer;
