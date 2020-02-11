import { observable, action } from "mobx";
import dotenv from "dotenv";

dotenv.config();

import { FsObject } from "../types/fs";
import S3Controller, { BucketNames } from "../utils/aws/S3Controller";

const s3Controller = new S3Controller();
export class S3Store {
  @observable bucketNames: BucketNames = [];
  @observable loading: boolean = false;
  @observable fsObjects: Array<FsObject> = [];

  @action
  selectBucket = (bucketName: string) => {
    if (bucketName) {
      s3Controller.ls(bucketName).then(fsObjects => {
        this.setFsObjets(fsObjects);
      });
    }
  };

  @action
  setBucketLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  setBucketNames(bucketNames: BucketNames) {
    this.bucketNames = bucketNames;
  }

  setCredential = (accessKeyId: string, secretAccessKey: string) => {
    this.setBucketLoading(true);
    return s3Controller
      .setCredential(accessKeyId, secretAccessKey)
      .then(bucketNames => {
        this.setBucketLoading(false);
        this.setBucketNames(bucketNames);
      })
      .catch(err => {
        this.setBucketLoading(false);
        // TODO 에러 처리
        throw err;
      });
  };

  @action
  setFsObjets(fsObjects: Array<FsObject>) {
    this.fsObjects = fsObjects;
  }
}
