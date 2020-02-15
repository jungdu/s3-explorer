import faker from "faker";

import {
  BucketNames,
  FsObject,
  FsFile,
  FsType,
  FsFolder,
  IS3Controller
} from "../../types/fs";

const BUCKET_NAMES = ["bucket1", "bucket2", "bucket3"];

export default class S3MockController implements IS3Controller {
  private getRandomFile(): FsFile {
    return {
      type: FsType.FILE,
      name: faker.system.fileName()
    };
  }

  private getRandomFolder(): FsFolder {
    return {
      type: FsType.FOLDER,
      name: faker.lorem.word()
    };
  }

  private getRandomFsObjects(count: number): Array<FsObject> {
    const result: Array<FsObject> = [];
    for (let i = 0; i < count; i++) {
      result.push(
        Math.random() > 0.7 ? this.getRandomFolder() : this.getRandomFile()
      );
    }
    return result;
  }

  setCredential() {
    return new Promise<BucketNames>(resolve => {
      resolve(BUCKET_NAMES);
    });
  }

  ls() {
    return new Promise<Array<FsObject>>(resolve => {
      resolve(this.getRandomFsObjects(50));
    });
  }
}
