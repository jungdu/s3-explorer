import React, { useContext, createContext } from "react";
import { observable, action } from "mobx";

type BucketNames = Array<string>;

class S3Store {
  @observable bucketNames: BucketNames = ["image", "mp3", "videos"];

  @action
  updateBucketName(bucketNames: BucketNames) {
    this.bucketNames = bucketNames;
  }
}

const s3 = new S3Store();

export const S3Context = createContext<S3Store>({} as S3Store);
export const S3Provider: React.FC = ({ children }) => {
  return <S3Context.Provider value={s3}> {children} </S3Context.Provider>;
};
export const useS3Store = (): S3Store => useContext(S3Context);
