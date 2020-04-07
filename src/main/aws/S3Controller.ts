import AWS, { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
import {
  getNameWithoutPath,
  getLocalPathWithoutName,
} from "@common/utils/format";

export default class S3Controller {
  private s3: S3 | null = null;

  private getS3(): S3 {
    if (this.s3) {
      return this.s3;
    } else {
      throw new Error("no S3 Object");
    }
  }

  download(
    bucketName: string,
    srcFileName: string,
    destPath: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const writeStream = fs.createWriteStream(destPath);

      this.getS3()
        .getObject({
          Bucket: bucketName,
          Key: srcFileName,
        })
        .createReadStream()
        .pipe(writeStream)
        .on("error", (err: any) => {
          if (err.code === "ENOENT") {
            fs.mkdir(
              getLocalPathWithoutName(destPath),
              { recursive: true },
              err => {
                if (err) {
                  reject(err);
                } else {
                  this.download(bucketName, srcFileName, destPath).then(
                    resolve
                  );
                }
              }
            );
          } else {
            reject(err);
          }
        })
        .on("close", function() {
          resolve(srcFileName);
        });
    });
  }

  setCredential(accessKeyId: string, secretAccessKey: string) {
    this.s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      signatureVersion: "v4",
      region: "ap-northeast-2",
    });
  }

  upload = (bucketName: string, destDir: string, filePath: string) => {
    return new Promise<string>((resolve, reject) => {
      const fileName = getNameWithoutPath(filePath);
      const params: S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: path.join(destDir, fileName),
        ContentType: filePath,
        Body: fs.createReadStream(filePath),
        ACL: "public-read", // 접근 권한
      };

      this.getS3().putObject(params, function(err) {
        if (err) {
          reject(err);
        }
        resolve(path.join(destDir, fileName));
      });
    });
  };
}
