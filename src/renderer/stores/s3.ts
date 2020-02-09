import { observable, action } from "mobx";

import { BucketNames, S3Ctl } from "../utils/aws/S3Ctl";

const s3Ctl = new S3Ctl();
export class S3Store {
  @observable bucketNames: BucketNames = [];

  setCredential(accessKeyId: string, secretAccessKey: string) {
    return s3Ctl
      .setCredential(accessKeyId, secretAccessKey)
      .then(bucketNames => {
        this.updateBucketNames(bucketNames);
      });
  }

  @action
  updateBucketNames(bucketNames: BucketNames) {
    this.bucketNames = bucketNames;
  }
}
