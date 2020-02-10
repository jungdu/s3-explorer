import { observable, action } from "mobx";
import dotenv from "dotenv";

dotenv.config();

import S3Controller, {
  BucketNames,
  FsObjectNames
} from "../utils/aws/S3Controller";

const s3Ctl = new S3Controller();
export class S3Store {
  @observable loading: boolean = false;
  @observable bucketNames: BucketNames = [];
  @observable fsObjectNames: FsObjectNames = {
    fileNames: [],
    folderNames: []
  };

  @action
  selectBucket(bucketName: string) {
    if (bucketName) {
      s3Ctl.ls(bucketName).then(fsObjectNames => {
        this.setFsObjectNames(fsObjectNames);
      });
    }
  }

  @action
  setBucketLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  setBucketNames(bucketNames: BucketNames) {
    this.bucketNames = bucketNames;
  }

  setCredential(accessKeyId: string, secretAccessKey: string) {
    this.setBucketLoading(true);
    return s3Ctl
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
  }

  @action
  setFsObjectNames(fsObjectNames: FsObjectNames) {
    this.fsObjectNames = fsObjectNames;
  }
}
