import { observable, action } from "mobx";

import { BucketNames, S3Ctl } from "../utils/aws/S3Ctl";

const s3Ctl = new S3Ctl();
export class S3Store {
  @observable bucketLoading: boolean = false;
  @observable bucketNames: BucketNames = [];

  setCredential(accessKeyId: string, secretAccessKey: string) {
    this.setBucketLoading(true);
    return s3Ctl
      .setCredential(accessKeyId, secretAccessKey)
      .then(bucketNames => {
        this.setBucketLoading(false);
        this.setBucketNames(bucketNames);
      })
      .catch(() => {
        this.setBucketLoading(false);
      });
  }

  @action
  setBucketNames(bucketNames: BucketNames) {
    this.bucketNames = bucketNames;
  }

  @action
  setBucketLoading(bucketLoading: boolean) {
    this.bucketLoading = bucketLoading;
  }
}
