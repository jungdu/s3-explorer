import AWS from "aws-sdk";
import S3, { ListBucketsOutput, ListObjectsV2Output } from "aws-sdk/clients/s3";

import { notNull, notUndefined } from "../typeGuards";

export interface FsObjectNames {
  fileNames: FileNames;
  folderNames: FolderNames;
}

export type BucketNames = Array<string>;
type FileNames = Array<string>;
type FolderNames = Array<string>;

export class S3Ctl {
  private s3: S3 | null = null;

  private getBucketNames(listBucketsOutput: ListBucketsOutput): BucketNames {
    const buckets = listBucketsOutput.Buckets;
    if (buckets) {
      return buckets.map(bucket => bucket.Name).filter(notUndefined);
    }
    return [];
  }

  private getFileAndFolderNames(
    listObjectsV2Output: ListObjectsV2Output
  ): FsObjectNames {
    return {
      fileNames: this.getFileNames(listObjectsV2Output),
      folderNames: this.getFolderNames(listObjectsV2Output)
    };
  }

  private getFileNames(listObjectsV2Output: ListObjectsV2Output): FileNames {
    const { Contents } = listObjectsV2Output;
    if (Contents) {
      return Contents.map(content => content.Key).filter(notUndefined);
    }
    return [];
  }

  private getFolderNames(
    listObjectsV2Output: ListObjectsV2Output
  ): FolderNames {
    const { CommonPrefixes } = listObjectsV2Output;
    if (CommonPrefixes) {
      return CommonPrefixes.map(prefix => prefix.Prefix).filter(notUndefined);
    }
    return [];
  }

  private getObjectInBucket(bucketName: string) {
    return new Promise<ListObjectsV2Output>((resolve, reject) => {
      if (notNull(this.s3)) {
        this.s3.listObjectsV2(
          {
            Bucket: bucketName,
            Delimiter: "/"
            //prefix 가 언제 필요할 때 알아보자
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

  ls(bucketName: string, folderName: string = "/") {
    return this.getObjectInBucket(bucketName, folderName).then(data => {
      return this.getFileAndFolderNames(data);
    });
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
