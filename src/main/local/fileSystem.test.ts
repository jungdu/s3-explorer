import { getAllLocalFilesInFolder } from "./fileSystem";

describe.only("file system", () => {
  test("this test file is in the 'local' folder", () => {
    return getAllLocalFilesInFolder(__dirname).then(result => {
      const idx = result.findIndex(filePath => filePath === __filename);
      expect(idx).toBeGreaterThan(-1);
    });
  });

  test("this test file is filePath in 'src' folder", () => {
    return getAllLocalFilesInFolder("./src").then(result => {
      const idx = result.findIndex(filePath => filePath === __filename);
      expect(idx).toBeGreaterThan(-1);
    });
  });
});
