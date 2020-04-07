import { Message } from "@common/types/ipc";
import { invoke } from "@renderer/utils/ipc";
import { notUndefined } from "@renderer/utils/typeGuards";
import AWS from "aws-sdk";
import S3, { ListBucketsOutput, ListObjectsV2Output } from "aws-sdk/clients/s3";
import nanoid from "nanoid";
import path from "path";
import {
  getRelativeFileName,
  isFolderName,
  getNameWithoutPath,
} from "@common/utils/format";
import {
  BucketNames,
  FsObject,
  FsFile,
  FsType,
  FsFolder,
} from "@renderer/types/fs";

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
            selected: false,
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
            selected: false,
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
          StartAfter: prefix,
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
    if (
      folderName.length > 0 &&
      folderName.charAt(folderName.length - 1) !== "/"
    ) {
      return true;
    }
    return false;
  }

  downloadFolder(
    bucketName: string,
    srcFolderName: string,
    destPath: string
  ): Promise<string[]> {
    return this.getAllFileInFolder(bucketName, srcFolderName).then(
      srcFileNames => {
        const pms = srcFileNames.map(srcFileName => {
          return this.download(
            bucketName,
            srcFileName,
            path.join(
              destPath,
              getNameWithoutPath(srcFolderName),
              getRelativeFileName(srcFolderName, srcFileName)
            )
          );
        });
        return Promise.all(pms);
      }
    );
  }

  download(
    bucketName: string,
    srcFileName: string,
    destPath: string
  ): Promise<string> {
    return invoke<Message.Download>({
      chanel: "DOWNLOAD",
      message: { bucketName, srcFileName, destPath },
    });
  }

  getAllFileInFolder(
    bucketName: string,
    folderName: string
  ): Promise<string[]> {
    return this.getAllObjectInFolder(bucketName, folderName).then(objects => {
      return objects.filter(object => !isFolderName(object));
    });
  }

  // 버킷 내 폴더 내에 있는 모든 파일 Key를 recursive하게 가져온다.
  getAllObjectInFolder(
    bucketName: string,
    folderName: string
  ): Promise<string[]> {
    const keys: string[] = [folderName];
    return this.getS3()
      .listObjects({
        Bucket: bucketName,
        Prefix: folderName,
      })
      .promise()
      .then(objects => {
        const folderNames: string[] = [];
        if (objects.Contents) {
          objects.Contents.forEach(content => {
            if (content.Key && content.Key !== folderName) {
              if (isFolderName(content.Key)) {
                folderNames.push(content.Key);
              }
              keys.push(content.Key);
            }
          });
        }
        if (folderNames.length > 0) {
          return Promise.all(
            folderNames.map(folderName =>
              this.getAllObjectInFolder(bucketName, folderName)
            )
          ).then(results => {
            results.forEach(result => {
              keys.concat(result);
            });
          });
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        return keys;
      });
  }

  mkdir(bucketName: string, folderName: string): Promise<boolean> {
    if (this.validateFolderName(bucketName)) {
      return new Promise((resolve, reject) => {
        this.getS3().putObject(
          {
            Bucket: bucketName,
            Key: folderName,
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

  rmFile(bucketName: string, fileName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getS3().deleteObject(
        {
          Bucket: bucketName,
          Key: fileName,
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

  rmFolder(bucketName: string, folderName: string): Promise<boolean> {
    return this.getAllObjectInFolder(bucketName, folderName)
      .then(fileNames => {
        const objects = fileNames.map(fileName => ({ Key: fileName }));
        return this.getS3()
          .deleteObjects({
            Bucket: bucketName,
            Delete: {
              Objects: objects,
            },
          })
          .promise();
      })
      .then(() => {
        return true;
      });
  }

  setCredential(accessKeyId: string, secretAccessKey: string) {
    return new Promise<BucketNames>((resolve, reject) => {
      const s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        signatureVersion: "v4",
        region: "ap-northeast-2",
      });

      s3.listBuckets((err, data) => {
        if (err) {
          return reject(new Error(`S3ctl.listBuckets error code:${err.code}`));
        }

        this.s3 = s3;
        invoke<Message.SetCredential>({
          chanel: "SET_CREDENTIAL",
          message: { accessKeyId, secretAccessKey },
        });
        return resolve(this.getBucketNames(data));
      });
    });
  }

  upload = (bucketName: string, destDir: string, fileName: string) => {
    return new Promise<string>(resolve => {
      invoke<Message.Upload>({
        chanel: "UPLOAD",
        message: { bucketName, destDir, filePath: fileName },
      }).then(() => {
        resolve();
      });
    });
  };
}
