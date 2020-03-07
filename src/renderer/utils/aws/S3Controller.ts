import AWS from "aws-sdk";
import S3, {
  ListBucketsOutput,
  ListObjectsV2Output,
  GetObjectRequest
} from "aws-sdk/clients/s3";
import fs from "fs";
import https from "https";
import nanoid from "nanoid";
import path from "path";

import {
  BucketNames,
  FsObject,
  FsFile,
  FsType,
  FsFolder
} from "@renderer/types/fs";
import { notUndefined } from "@renderer/utils/typeGuards";

export default class S3Controller {
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
            id: nanoid(),
            name: content.Key,
            type: FsType.FILE,
            selected: false
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
            id: nanoid(),
            name: prefix.Prefix,
            type: FsType.FOLDER,
            childNames: [],
            selected: false
          };
          result.push(folder);
        }
      });
    }
    return result;
  }

  private getListObjects(bucketName: string, prefix: string) {
    return new Promise<ListObjectsV2Output>((resolve, reject) => {
      this.getS3().listObjectsV2(
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
    });
  }

  private getS3(): S3 {
    if (this.s3) {
      return this.s3;
    } else {
      throw new Error("no S3 Object");
    }
  }

  private validateFolderName(folderName: string): boolean {
    console.log("folderName :", folderName);
    if (
      folderName.length > 0 &&
      folderName.charAt(folderName.length - 1) !== "/"
    ) {
      return true;
    }
    return false;
  }

  download(
    bucketName: string,
    srcFileName: string,
    distPath: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const params: GetObjectRequest = {
        Bucket: bucketName,
        Key: srcFileName
      };

      this.getS3()
        .getSignedUrlPromise("getObject", params)
        .then(signedUrl => {
          https.get(signedUrl).on("response", function(res) {
            const writeStream = fs.createWriteStream(distPath);
            res
              .pipe(writeStream)
              .on("finish", () => {
                resolve(distPath);
              })
              .on("error", err => {
                reject({ ...err, srcFileName });
              });
          });
        });
    });
  }

  mkdir(bucketName: string, folderName: string): Promise<boolean> {
    if (this.validateFolderName(bucketName)) {
      return new Promise((resolve, reject) => {
        this.getS3().putObject(
          {
            Bucket: bucketName,
            Key: folderName
          },
          err => {
            if (err) {
              reject(err);
            }
            resolve(true);
          }
        );
      });
    } else {
      return Promise.reject(new Error("Invalid folder name"));
    }
  }

  ls(bucketName: string, folderName: string = ""): Promise<Array<FsObject>> {
    return this.getListObjects(bucketName, folderName).then(data =>
      this.getFsObjects(data)
    );
  }

  rm(bucketName: string, fileName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.s3?.deleteObject(
        {
          Bucket: bucketName,
          Key: fileName
        },
        err => {
          if (err) {
            reject(err);
          }
          resolve(true);
        }
      );
    });
  }

  setCredential(accessKeyId: string, secretAccessKey: string) {
    return new Promise<BucketNames>((resolve, reject) => {
      const s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        signatureVersion: "v4",
        region: "ap-northeast-2"
      });

      s3.listBuckets((err, data) => {
        if (err) {
          return reject(new Error(`S3ctl.listBuckets error code:${err.code}`));
        }

        this.s3 = s3;
        return resolve(this.getBucketNames(data));
      });
    });
  }

  upload(bucketName: string, destDir: string, file: File) {
    return new Promise<string>((resolve, reject) => {
      var params: S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: path.join(destDir, file.name),
        ContentType: file.type,
        Body: file,
        ACL: "public-read" // 접근 권한
      };
      this.getS3().putObject(params, function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data.ETag);
      });
    });
  }
}
