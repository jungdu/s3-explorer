import { S3Store } from "@renderer/stores/s3";
import { UiState } from "@renderer/stores/uiState";
import S3Controller from "@renderer/utils/aws/S3Controller";
import React, { createContext, useContext } from "react";
// import S3MockController from "@renderer/utils/aws/S3MockController";

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
    useStore,
  };
}

const s3Store = new S3Store(new S3Controller());
export const uiStateStore = new UiState();

export const s3 = createConnector(s3Store);
export const uiState = createConnector(uiStateStore);
