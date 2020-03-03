import faker from "faker";
import nanoid from "nanoid";

// Mock 개발은 Storybook과 함께 중단...
import {
  BucketNames,
  FsObject,
  FsFile,
  FsType,
  FsFolder
} from "@renderer/types/fs";

const BUCKET_NAMES = ["bucket1", "bucket2", "bucket3"];

export default class S3MockController {
  private getRandomFile(): FsFile {
    return {
      id: nanoid(),
      name: faker.system.fileName(),
      type: FsType.FILE
    };
  }

  private getRandomFolder(): FsFolder {
    return {
      children: [],
      id: nanoid(),
      name: faker.lorem.word(),
      type: FsType.FOLDER
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

  download(
    bucketName: string,
    fileName: string,
    distPath: string
  ): Promise<string> {
    return new Promise(resolve => {
      resolve(distPath);
    });
  }

  setCredential() {
    return new Promise<BucketNames>(resolve => {
      resolve(BUCKET_NAMES);
    });
  }

  ls() {
    return new Promise<Array<FsObject>>(resolve => {
      resolve(this.getRandomFsObjects(20));
    });
  }
}
