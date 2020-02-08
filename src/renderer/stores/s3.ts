import { observable, action } from "mobx";

type BucketNames = Array<string>;

export class S3Store {
  @observable bucketNames: BucketNames = ["image", "mp3", "videos"];

  @action
  updateBucketName(bucketNames: BucketNames) {
    this.bucketNames = bucketNames;
  }
}
