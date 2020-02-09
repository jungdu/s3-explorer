import AWS from "aws-sdk";
import S3, { Buckets } from "aws-sdk/clients/s3";

import { notUndefined } from "../typeGuards";

export type BucketNames = Array<string>;

export class S3Ctl {
  private s3: S3 | null = null;
  buckets: Buckets = [];

  get bucketNames(): BucketNames {
    return this.buckets.map(bucket => bucket.Name).filter(notUndefined);
  }

  setCredential(accessKeyId: string, secretAccessKey: string) {
    return new Promise<BucketNames>((resolve, reject) => {
      const s3 = new AWS.S3({ accessKeyId, secretAccessKey });

      s3.listBuckets((err, data) => {
        if (err) {
          return reject(new Error(`S3ctl.listBuckets error code:${err.code}`));
        }

        if (data.Buckets) {
          this.buckets = data.Buckets;
        }

        this.s3 = s3;

        return resolve(this.bucketNames);
      });
    });
  }
}
