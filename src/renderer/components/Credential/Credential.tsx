import styled from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import TextInput from "@renderer/components/common/TextInput";

const Self = styled.div``;

const CredentialInput = styled(TextInput)`
  & ~ & {
    margin-top: 5px;
  }
`;

const ConfirmButton = styled.button`
  color: ${props => props.theme.color.primaryDark};
  padding: 7px 10px;
  border: 1px solid ${props => props.theme.color.primaryDark};
  background: none;
  cursor: pointer;
`;

const ConfirmButtonContainer = styled.div`
  display: flex;
  margin-top: 15px;
  justify-content: flex-end;
`;

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
      <ConfirmButtonContainer>
        <ConfirmButton onClick={handleOnClick}>LOGIN</ConfirmButton>
      </ConfirmButtonContainer>
    </Self>
  );
};

export default Credential;
