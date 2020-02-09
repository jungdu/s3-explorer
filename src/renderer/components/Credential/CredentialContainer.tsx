import React from "react";

import Credential from "./Credential";

const CredentialContainer: React.FC = () => {
  return (
    <Credential
      onSetCredential={() => {
        console.log("onCheck");
      }}
    ></Credential>
  );
};

export default CredentialContainer;
