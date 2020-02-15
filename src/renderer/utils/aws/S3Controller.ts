import AWS from "aws-sdk";
import S3, { ListBucketsOutput, ListObjectsV2Output } from "aws-sdk/clients/s3";

import {
  BucketNames,
  FsObject,
  FsFile,
  FsType,
  FsFolder,
  IS3Controller
} from "../../types/fs";
import { notNull, notUndefined } from "../typeGuards";

export default class S3Controller implements IS3Controller {
  private s3: S3 | null = null;

  private getBucketNames(listBucketsOutput: ListBucketsOutput): BucketNames {
    const buckets = listBucketsOutput.Buckets;
    if (buckets) {
      return buckets.map(bucket => bucket.Name).filter(notUndefined);
    }
    return [];
  }

  private getFsObjects(
    listObjectsV2Output: ListObjectsV2Output
  ): Array<FsObject> {
    const folders = this.getFolders(listObjectsV2Output);
    const files = this.getFiles(listObjectsV2Output);
    return [...folders, ...files];
  }

  private getFiles(listObjectsV2Output: ListObjectsV2Output): Array<FsFile> {
    const { Contents } = listObjectsV2Output;
    const result: Array<FsFile> = [];
    if (Contents) {
      Contents.forEach(content => {
        if (content.Key) {
          result.push({
            type: FsType.FILE,
            name: content.Key
          });
        }
      });
    }
    return result;
  }

  private getFolders(
    listObjectsV2Output: ListObjectsV2Output
  ): Array<FsFolder> {
    const { CommonPrefixes } = listObjectsV2Output;
    const result: Array<FsFolder> = [];
    if (CommonPrefixes) {
      CommonPrefixes.forEach(prefix => {
        if (prefix.Prefix) {
          const folder: FsFolder = {
            type: FsType.FOLDER,
            name: prefix.Prefix
          };
          result.push(folder);
        }
      });
    }
    return result;
  }

  private getListObjects(bucketName: string, prefix: string) {
    return new Promise<ListObjectsV2Output>((resolve, reject) => {
      if (notNull(this.s3)) {
        this.s3.listObjectsV2(
          {
            Bucket: bucketName,
            Delimiter: "/",
            Prefix: prefix,
            StartAfter: prefix
          },
          (err, data) => {
            if (err) {
              reject(new Error(`S3ctl.listObjectV2 error code:${err.code}`));
            }
            resolve(data);
          }
        );
      } else {
        throw new Error("no S3 Object");
      }
    });
  }

  ls(bucketName: string, folderName: string = ""): Promise<Array<FsObject>> {
    return this.getListObjects(bucketName, folderName).then(data =>
      this.getFsObjects(data)
    );
  }

  setCredential(accessKeyId: string, secretAccessKey: string) {
    return new Promise<BucketNames>((resolve, reject) => {
      const s3 = new AWS.S3({ accessKeyId, secretAccessKey });

      s3.listBuckets((err, data) => {
        if (err) {
          return reject(new Error(`S3ctl.listBuckets error code:${err.code}`));
        }

        this.s3 = s3;
        return resolve(this.getBucketNames(data));
      });
    });
  }
}
