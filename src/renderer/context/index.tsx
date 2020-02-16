import React, { createContext, useContext } from "react";

import { S3Store } from "@renderer/stores/s3";
import S3Controller from "@renderer/utils/aws/S3Controller";
import S3MockController from "@renderer/utils/aws/S3MockController";

function createConnector<T>(storeInstance: T) {
  const context = createContext<T>({} as T);
  const Provider: React.FC = ({ children }) => {
    return (
      <context.Provider value={storeInstance}>{children}</context.Provider>
    );
  };
  const useStore = (): T => useContext(context);

  return {
    Provider,
    useStore
  };
}

const s3Store = new S3Store(
  process.env.ENV === "storybook" ? new S3MockController() : new S3Controller()
);
export const s3 = createConnector(s3Store);
