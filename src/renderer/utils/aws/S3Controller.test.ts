import dotenv from "dotenv";
import fs from "fs";
import S3Controller from "./S3Controller";

dotenv.config();

// 테스트를 진행할 버킷과 폴더 구조를 먼저 S3에 구성해야한다.
// 아래에서 진행한 테스트 버킷(test-s3-explorer) 의 폴더 구조는 아래와 같다.
// first-file.txt
// first-folder/
// first-folder/file-in-folder.txt

const TEST_BUCKET = "test-s3-explorer";
const TEST_FILE_IN_ROOT = "first-file.txt";
const CONTENT_OF_FILE_IN_ROOT = "first"; // TEST_FILE_IN_ROOT에 쓰여진 내용
const TEST_FILE_IN_FOLDER_IN_ROOT = "first-folder/file-in-folder.txt";
const TEST_FOLDER_IN_ROOT = "first-folder/";

describe.skip("S3test with AWS SDK", () => {
  const s3Controller = new S3Controller();

  function setDefaultCredential() {
    return s3Controller.setCredential(
      process.env.DEFAULT_ACCESS_KEY_ID as string,
      process.env.DEFAULT_SECRET_ACCESS_KEY as string
    );
  }

  beforeAll(() => {
    return setDefaultCredential();
  });

  test("Setting credential with default key", () => {
    return setDefaultCredential().then(bucketNames => {
      expect(Array.isArray(bucketNames)).toBe(true);
    });
  });

  test("Default user has test bucket", () => {
    return setDefaultCredential().then(bucketNames => {
      expect(bucketNames.length).toBeGreaterThan(0);
      expect(bucketNames).toContain(TEST_BUCKET);
    });
  });

  test('Execute "ls" command in the test bucket', () => {
    return s3Controller.ls(TEST_BUCKET).then(fsObjects => {
      expect(Array.isArray(fsObjects)).toBe(true);
      const objectNames = fsObjects.map(fsObject => fsObject.name);
      expect(objectNames).toContain(TEST_FILE_IN_ROOT);
      expect(objectNames).toContain(TEST_FOLDER_IN_ROOT);
    });
  });

  test(`Execute "ls" a folder`, () => {
    return s3Controller.ls(TEST_BUCKET, TEST_FOLDER_IN_ROOT).then(fsObjects => {
      expect(Array.isArray(fsObjects)).toBe(true);
      const objectNames = fsObjects.map(fsObject => fsObject.name);
      expect(objectNames).toContain(TEST_FILE_IN_FOLDER_IN_ROOT);
    });
  });

  test("Download file", () => {
    const destPath = `${process.cwd()}/download/${TEST_FILE_IN_ROOT}`;
    return s3Controller
      .download(TEST_BUCKET, TEST_FILE_IN_ROOT, destPath)
      .then(fileName => {
        expect(fileName).toEqual(TEST_FILE_IN_ROOT);
        expect(fs.readFileSync(destPath, "utf8")).toEqual(
          CONTENT_OF_FILE_IN_ROOT
        );
      })
      .catch(err => {
        console.log("err :", err);
      });
  });

  test("Create folder in bucket", () => {
    return s3Controller.mkdir(TEST_BUCKET, "newFolder/").then(result => {
      expect(result).toBe(true);
    });
  });
});
