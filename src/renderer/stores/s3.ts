import { observable, action } from "mobx";
import dotenv from "dotenv";

dotenv.config();

import { FsObject, FsFolder } from "../types/fs";
import S3Controller, { BucketNames } from "../utils/aws/S3Controller";

export class S3Store {
  s3Controller = new S3Controller();

  @observable bucketNames: BucketNames = [];
  @observable fsObjects: Array<FsObject> = [];
  @observable loading: boolean = false;
  @observable selectedBucket: string | null = null;

  openFolder = (folder: FsFolder) => {
    if (this.selectedBucket) {
      this.s3Controller.ls(this.selectedBucket, folder.name).then(fsObjects => {
        this.setFsObjects(fsObjects);
      });
    } else {
      throw new Error("no selectedBucket");
    }
  };

  @action
  selectBucket = (bucketName: string) => {
    if (bucketName) {
      this.s3Controller.ls(bucketName).then(fsObjects => {
        this.setSelectedBucket(bucketName);
        this.setFsObjects(fsObjects);
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
    return this.s3Controller
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
  setFsObjects(fsObjects: Array<FsObject>) {
    this.fsObjects = fsObjects;
  }

  @action
  setSelectedBucket(bucketName: string) {
    this.selectedBucket = bucketName;
  }
}
