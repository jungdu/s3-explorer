import React, { createContext, useContext } from "react";
import { S3Store } from "../stores/s3";

function createConnector<T>(storeClass: new () => T) {
  const store: T = new storeClass();
  const context = createContext<T>({} as T);
  const Provider: React.FC = ({ children }) => {
    return <context.Provider value={store}>{children}</context.Provider>;
  };
  const useStore = (): T => useContext(context);

  return {
    Provider,
    useStore
  };
}

export const s3 = createConnector(S3Store);
