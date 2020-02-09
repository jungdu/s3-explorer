import dotenv from "dotenv";

import { S3Ctl } from "./S3ctl";

dotenv.config();

describe("S3test with AWS SDK", () => {
  const s3Ctl = new S3Ctl();

  function setDefaultCredential() {
    return s3Ctl.setCredential(
      process.env.DEFAULT_ACCESS_KEY_ID as string,
      process.env.DEFAULT_SECRET_ACCESS_KEY as string
    );
  }

  test("Setting credential with default key", () => {
    return setDefaultCredential().then(bucketNames => {
      expect(Array.isArray(bucketNames)).toBe(true);
    });
  });

  test("Default user has at lesat one bucket to explore", () => {
    return setDefaultCredential().then(bucketNames => {
      expect(bucketNames.length).toBeGreaterThan(0);
    });
  });

  test('Execute "ls" command in the first bucket', () => {
    return setDefaultCredential()
      .then(bucketNames => {
        return s3Ctl.ls(bucketNames[0]);
      })
      .then(data => {
        expect(Array.isArray(data.fileNames)).toBe(true);
        expect(Array.isArray(data.folderNames)).toBe(true);
      });
  });
});
