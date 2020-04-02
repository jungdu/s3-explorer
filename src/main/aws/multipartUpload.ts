import { S3 } from "aws-sdk";
import { CompletedPart } from "aws-sdk/clients/s3";
import fs from "fs";

// 대용량 파일을 전송할 때 multiPart로 보내야 한다고 한다.
// 작은 크기의 파일은 못올림.
// 아직은 사용할 일이 없으나 나중에 사용할 수 있음

function uploadPart(
  s3: S3,
  chunk: string,
  bucket: string,
  key: string,
  partNumber: number,
  uploadId: string
): Promise<CompletedPart> {
  return new Promise((resolve, reject) => {
    const params = {
      Body: chunk,
      Bucket: bucket,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
    };
    s3.uploadPart(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve({
          ETag: data.ETag,
          PartNumber: partNumber,
        });
      }
    });
  });
}

function createMultipartUpload(
  s3: S3,
  bucket: string,
  key: string
): Promise<string> {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return new Promise((resolve, reject) => {
    s3.createMultipartUpload(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.UploadId);
      }
    });
  });
}

function completeMultipartUpload(
  s3: S3,
  bucket: string,
  key: string,
  uploadId: string,
  parts: CompletedPart[]
): Promise<boolean> {
  return s3
    .completeMultipartUpload({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    })
    .promise()
    .then(() => {
      return true;
    });
}

export function uploadFileByMultiPart(
  s3: S3,
  bucket: string,
  key: string,
  localFilePath: string
): Promise<boolean> {
  return new Promise(resolve => {
    createMultipartUpload(s3, bucket, key).then(uploadId => {
      let partNumber = 0;
      const completedParts: CompletedPart[] = [];
      const fileStream = fs.createReadStream(localFilePath);
      fileStream.on("data", chunk => {
        partNumber++;
        fileStream.pause();
        uploadPart(s3, chunk, bucket, key, partNumber, uploadId).then(
          completedPart => {
            completedParts.push(completedPart);
            fileStream.resume();
          }
        );
      });

      fileStream.on("end", () => {
        completeMultipartUpload(s3, bucket, key, uploadId, completedParts).then(
          () => {
            resolve(true);
          }
        );
      });
    });
  });
}
