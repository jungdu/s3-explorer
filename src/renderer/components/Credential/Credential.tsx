import React, { useState, useCallback } from "react";

interface Props {
  onSetCredential: (accessKeyId: string, secretAccessId: string) => void;
}

const Credential: React.FC<Props> = ({ onSetCredential }) => {
  const [accessKeyId, setAccessKeyId] = useState<string>(
    "Default Access Key ID"
  );
  const [secretAccessKey, setSecretAccessKey] = useState<string>(
    "Default Secret Access Key"
  );

  const handleOnClick = useCallback(() => {
    onSetCredential(accessKeyId, secretAccessKey);
  }, [onSetCredential]);

  return (
    <div>
      <div>
        accessKeyId :
        <input
          type="text"
          value={accessKeyId}
          onChange={e => setAccessKeyId(e.target.value)}
        />
      </div>
      <div>
        SecretAccessKey :
        <input
          type="text"
          value={secretAccessKey}
          onChange={e => setSecretAccessKey(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleOnClick}>확인</button>
      </div>
    </div>
  );
};

export default Credential;
