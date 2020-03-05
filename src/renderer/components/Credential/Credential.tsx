import React, { useState, useCallback, useEffect } from "react";

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
