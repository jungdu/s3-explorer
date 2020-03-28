import styled from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import TextInput from "@renderer/components/common/TextInput";

const CredentialInput = styled(TextInput)`
  & ~ & {
    margin-top: 10px;
  }
`;

const Self = styled.div``;

interface Props {
  onSetCredential: (accessKeyId: string, secretAccessId: string) => void;
}

const Credential: React.FC<Props> = ({ onSetCredential }) => {
  const [accessKeyId, setAccessKeyId] = useState<string>(
    process.env.DEFAULT_ACCESS_KEY_ID ? process.env.DEFAULT_ACCESS_KEY_ID : ""
  );
  const [secretAccessKey, setSecretAccessKey] = useState<string>(
    process.env.DEFAULT_SECRET_ACCESS_KEY
      ? process.env.DEFAULT_SECRET_ACCESS_KEY
      : ""
  );

  const handleOnClick = useCallback(() => {
    onSetCredential(accessKeyId, secretAccessKey);
  }, [accessKeyId, onSetCredential, secretAccessKey]);

  // default credential으로 바로 버킷 까지 불러올 수 있도록
  useEffect(() => {
    if (accessKeyId && secretAccessKey) {
      handleOnClick();
    }
  }, []);

  return (
    <Self>
      <CredentialInput
        label="accessKeyId"
        onChange={e => {
          setAccessKeyId(e.target.value);
        }}
        value={accessKeyId}
      />
      <CredentialInput
        label="SecretAccessKey"
        onChange={e => {
          setSecretAccessKey(e.target.value);
        }}
        value={secretAccessKey}
      />
      <div>
        <button onClick={handleOnClick}>확인</button>
      </div>
    </Self>
  );
};

export default Credential;
