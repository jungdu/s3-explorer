import React from "react";

import { s3 } from "../../context";
import Credential from "./Credential";
import { useObserver } from "mobx-react";

const CredentialContainer: React.FC = () =>
  useObserver(() => {
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
